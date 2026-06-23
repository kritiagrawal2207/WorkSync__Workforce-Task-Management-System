using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkSyncAPI.DTOs.Attendance;
using WorkSyncAPI.Services.Interfaces;

namespace WorkSyncAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class AttendanceController : ControllerBase
{
   private readonly IAttendanceService _attendanceService;
    public AttendanceController(IAttendanceService attendanceService)
        => _attendanceService = attendanceService;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _attendanceService.GetAllAsync());

    [HttpGet("employee/{employeeId}")]
    public async Task<IActionResult> GetByEmployee(int employeeId) =>
        Ok(await _attendanceService.GetByEmployeeIdAsync(employeeId));

    [HttpGet("employee/{employeeId}/today")]
    public async Task<IActionResult> GetToday(int employeeId)
    {
        var attendance = await _attendanceService.GetTodayByEmployeeIdAsync(employeeId);
        if (attendance == null) return NotFound();
        return Ok(attendance);
    }
    [HttpPost]
    public async Task<IActionResult> Create(AttendanceCreateDto dto)
    {
       
        var attendance = await _attendanceService.CreateAsync(dto);
        return Ok(attendance);
    }

    [HttpPut("{id}/checkout")]
    public async Task<IActionResult> CheckOut(int id, AttendanceUpdateDto dto)
    {
        var (success, message, attendance) = await _attendanceService.CheckOutAsync(id, dto);
        if (!success) return NotFound(message);
        return Ok(attendance);
    }
}
