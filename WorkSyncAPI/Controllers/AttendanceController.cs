using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkSyncAPI.DTOs.Attendance;
using WorkSyncAPI.Models;
using WorkSyncAPI.Repositories.Interfaces;

namespace WorkSyncAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class AttendanceController : ControllerBase
{
    private readonly IAttendanceRepository _repo;
    public AttendanceController(IAttendanceRepository repo) => _repo = repo;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _repo.GetAllAsync());

    [HttpGet("employee/{employeeId}")]
    public async Task<IActionResult> GetByEmployee(int employeeId) =>
        Ok(await _repo.GetByEmployeeIdAsync(employeeId));

    [HttpPost]
    public async Task<IActionResult> Create(AttendanceCreateDto dto)
    {
        var attendance = new Attendance
        {
            EmployeeId = dto.EmployeeId,
            CheckIn = dto.CheckIn,
            CheckOut = dto.CheckOut,
            Status = dto.Status
        };
        await _repo.AddAsync(attendance);
        await _repo.SaveAsync();
        return Ok(attendance);
    }

    [HttpPut("{id}/checkout")]
    public async Task<IActionResult> CheckOut(int id, AttendanceUpdateDto dto)
    {
        var attendance = await _repo.GetByIdAsync(id);
        if (attendance == null) return NotFound();
        attendance.CheckOut = dto.CheckOut;
        attendance.Status = dto.Status;
        await _repo.SaveAsync();
        return Ok(attendance);
    }
}
