using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkSyncAPI.Data;
using WorkSyncAPI.DTOs;
using WorkSyncAPI.Services.Interfaces;
namespace WorkSyncAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService     _employeeService;
        private readonly IActivityLogService  _logService;
        private readonly ApplicationDbContext _context;
        public EmployeeController(
            IEmployeeService employeeService,
            IActivityLogService logService,
            ApplicationDbContext context)
        {
            _employeeService = employeeService;
            _logService      = logService;
            _context         = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var employees = await _employeeService.GetAllEmployeesAsync();
            return Ok(employees);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var emp = await _employeeService.GetEmployeeByIdAsync(id);
            return emp == null ? NotFound(new { message = $"Employee {id} not found." }) : Ok(emp);
        }
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] EmployeeCreateDto dto)
        {
            try
            {
                var employee = await _employeeService.CreateEmployeeAsync(dto);
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                int? userId     = userIdClaim != null ? int.Parse(userIdClaim) : null;
                await _logService.LogAsync(
                    action:      "EmployeeCreated",
                    entityType:  "Employee",
                    entityId:    employee.Id,
                    description: $"Employee '{employee.Name}' created",
                    userId:      userId
                );
                return Ok(employee);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] EmployeeCreateDto dto)
        {
            try
            {
                var employee = await _employeeService.UpdateEmployeeAsync(id, dto);
                if (employee == null)
                    return NotFound(new { message = $"Employee {id} not found." });
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                int? userId     = userIdClaim != null ? int.Parse(userIdClaim) : null;
                await _logService.LogAsync(
                    action:      "EmployeeUpdated",
                    entityType:  "Employee",
                    entityId:    id,
                    description: $"Employee '{employee.Name}' updated",
                    userId:      userId
                );
                return Ok(employee);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _employeeService.DeleteEmployeeAsync(id);
            if (!result)
                return NotFound(new { message = $"Employee {id} not found." });
            return Ok(new { message = "Employee deleted successfully." });
        }
        [HttpPut("{id}/activate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Activate(int id)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Id == id);
            if (employee == null)
                return NotFound(new { message = $"Employee {id} not found." });
            if (employee.UserId == null)
                return BadRequest(new { message = "Employee has no linked user account." });
            var user = await _context.Users.FindAsync(employee.UserId);
            if (user == null)
                return NotFound(new { message = "Linked user not found." });
            user.IsActive = true;
            await _context.SaveChangesAsync();
            var adminIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            int? adminId     = adminIdClaim != null ? int.Parse(adminIdClaim) : null;
            await _logService.LogAsync(
                action:      "EmployeeActivated",
                entityType:  "Employee",
                entityId:    id,
                description: $"Employee '{employee.Name}' activated by admin",
                userId:      adminId
            );
            return Ok(new { message = $"Employee '{employee.Name}' activated successfully.", isActive = true });
        }
        [HttpPut("{id}/deactivate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Deactivate(int id)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Id == id);
            if (employee == null)
                return NotFound(new { message = $"Employee {id} not found." });
            if (employee.UserId == null)
                return BadRequest(new { message = "Employee has no linked user account." });
            var user = await _context.Users.FindAsync(employee.UserId);
            if (user == null)
                return NotFound(new { message = "Linked user not found." });
            user.IsActive = false;
            await _context.SaveChangesAsync();
            var adminIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            int? adminId     = adminIdClaim != null ? int.Parse(adminIdClaim) : null;
            await _logService.LogAsync(
                action:      "EmployeeDeactivated",
                entityType:  "Employee",
                entityId:    id,
                description: $"Employee '{employee.Name}' deactivated by admin",
                userId:      adminId
            );
            return Ok(new { message = $"Employee '{employee.Name}' deactivated successfully.", isActive = false });
        }
    }
}