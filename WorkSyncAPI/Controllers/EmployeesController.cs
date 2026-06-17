using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkSyncAPI.Models;
using WorkSyncAPI.Repositories.Interfaces;

namespace WorkSyncAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmployeeController : ControllerBase
{
    private readonly IEmployeeRepository _repo;
    public EmployeeController(IEmployeeRepository repo) => _repo = repo;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _repo.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var emp = await _repo.GetByIdAsync(id);
        return emp == null ? NotFound() : Ok(emp);
    }

    [HttpPost]
    public async Task<IActionResult> Add(Employee employee)
    {
        if (await _repo.EmailExistsAsync(employee.Email))
            return BadRequest("Employee already exists with this email");

        await _repo.AddAsync(employee);
        await _repo.SaveAsync();
        return Ok(employee);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Employee employee)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null) return NotFound();

        existing.Name = employee.Name;
        existing.Email = employee.Email;
        existing.Phone = employee.Phone;
        existing.DepartmentId = employee.DepartmentId;

        await _repo.UpdateAsync(existing);
        await _repo.SaveAsync();
        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var emp = await _repo.GetByIdAsync(id);
        if (emp == null) return NotFound();

        await _repo.DeleteAsync(emp);
        await _repo.SaveAsync();
        return Ok("Employee Deleted");
    }
}