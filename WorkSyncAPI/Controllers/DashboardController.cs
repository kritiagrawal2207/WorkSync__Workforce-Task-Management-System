using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WorkSyncAPI.Data;
using WorkSyncAPI.Services.Interfaces;
namespace WorkSyncAPI.Controllers;
[Route("api/[controller]")]
[ApiController]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;
    private readonly ApplicationDbContext _context;

    public DashboardController(IDashboardService dashboardService, ApplicationDbContext context)
    {
        _dashboardService = dashboardService;
        _context = context;
    }
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        if (string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase))
        {
            var summary = await _dashboardService.GetSummaryAsync();
            return Ok(summary);
        }
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(email))
            return Unauthorized(new { message = "Cannot identify current user." });

        var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Email == email);
        if (employee == null)
            return NotFound(new { message = "No employee profile linked to this account." });

        var employeeSummary = await _dashboardService.GetEmployeeSummaryAsync(employee.Id);
        return Ok(employeeSummary);
    }
}