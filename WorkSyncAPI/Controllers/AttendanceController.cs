using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkSyncAPI.DTOs.Attendance;
using WorkSyncAPI.Services.Interfaces;
namespace WorkSyncAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService  _service;
        private readonly IActivityLogService _logService;
        public AttendanceController(IAttendanceService service, IActivityLogService logService)
        {
            _service    = service;
            _logService = logService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list   = await _service.GetAllAsync();
            var result = list.Select(a => new AttendanceResponseDto
            {
                Id           = a.Id,
                EmployeeId   = a.EmployeeId,
                EmployeeName = a.Employee?.Name ?? "",
                CheckIn      = a.CheckIn,
                CheckOut     = a.CheckOut,
                Status       = a.Status
            });
            return Ok(result);
        }
        [HttpGet("employee/{employeeId}")]
        public async Task<IActionResult> GetByEmployee(int employeeId)
        {
            var list   = await _service.GetByEmployeeIdAsync(employeeId);
            var result = list.Select(a => new AttendanceResponseDto
            {
                Id           = a.Id,
                EmployeeId   = a.EmployeeId,
                EmployeeName = a.Employee?.Name ?? "",
                CheckIn      = a.CheckIn,
                CheckOut     = a.CheckOut,
                Status       = a.Status
            });
            return Ok(result);
        }
        [HttpGet("employee/{employeeId}/today")]
        public async Task<IActionResult> GetToday(int employeeId)
        {
            var a = await _service.GetTodayByEmployeeIdAsync(employeeId);
            if (a == null) return NotFound(new { message = "No attendance record for today." });
            return Ok(new AttendanceResponseDto
            {
                Id           = a.Id,
                EmployeeId   = a.EmployeeId,
                EmployeeName = a.Employee?.Name ?? "",
                CheckIn      = a.CheckIn,
                CheckOut     = a.CheckOut,
                Status       = a.Status
            });
        }
        [HttpPost]
        public async Task<IActionResult> CheckIn(AttendanceCreateDto dto)
        {
            var existing = await _service.GetTodayByEmployeeIdAsync(dto.EmployeeId);
            if (existing != null)
                return BadRequest(new { message = "Already checked in today." });
            dto.CheckIn = DateTime.UtcNow;
            dto.Status  = "Present";
            var attendance = await _service.CreateAsync(dto);
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            int? userId     = userIdClaim != null ? int.Parse(userIdClaim) : null;
            await _logService.LogAsync(
                action:      "CheckIn",
                entityType:  "Attendance",
                entityId:    attendance.Id,
                description: $"Employee {dto.EmployeeId} checked in at {attendance.CheckIn:HH:mm:ss} UTC",
                userId:      userId
            );
            return Ok(new { message = "Checked in successfully.", attendanceId = attendance.Id });
        }
        [HttpPut("{id}/checkout")]
        public async Task<IActionResult> CheckOut(int id, AttendanceUpdateDto dto)
        {
            dto.CheckOut = DateTime.UtcNow;
            var (success, message, attendance) = await _service.CheckOutAsync(id, dto);
            if (!success) return NotFound(new { message });
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            int? userId     = userIdClaim != null ? int.Parse(userIdClaim) : null;
            await _logService.LogAsync(
                action:      "CheckOut",
                entityType:  "Attendance",
                entityId:    id,
                description: $"Employee {attendance!.EmployeeId} checked out at {attendance.CheckOut:HH:mm:ss} UTC",
                userId:      userId
            );
            return Ok(new AttendanceResponseDto
            {
                Id         = attendance!.Id,
                EmployeeId = attendance.EmployeeId,
                CheckIn    = attendance.CheckIn,
                CheckOut   = attendance.CheckOut,
                Status     = attendance.Status
            });
        }
    }
}