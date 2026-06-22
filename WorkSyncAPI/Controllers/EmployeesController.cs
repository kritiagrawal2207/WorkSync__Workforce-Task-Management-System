using Microsoft.EntityFrameworkCore;
using WorkSyncAPI.DTOs;
using WorkSyncAPI.Data;
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
private readonly ApplicationDbContext _context;

public EmployeeController(IEmployeeRepository repo, ApplicationDbContext context)
{
    _repo = repo;
    _context = context;
}

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _repo.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var emp = await _repo.GetByIdAsync(id);
        return emp == null ? NotFound() : Ok(emp);
    }

   [HttpPost]
public async Task<IActionResult> Add([FromBody] EmployeeCreateDto dto)
{
    if (await _repo.EmailExistsAsync(dto.Email))
        return BadRequest("Employee already exists with this email");

    var department = await _context.Departments
        .FirstOrDefaultAsync(d => d.Name.ToLower() == dto.Department.ToLower());

    if (department == null)
        return BadRequest("Invalid department");

    var employee = new Employee
    {
        Name = dto.Name,
        Email = dto.Email,
        Phone = dto.Phone,
        DepartmentId = department.Id
    };

    await _repo.AddAsync(employee);
    await _repo.SaveAsync();
    return Ok(employee);
}

   [HttpPut("{id}")]
public async Task<IActionResult> Update(int id, [FromBody] EmployeeCreateDto dto)
{
    var existing = await _repo.GetByIdAsync(id);
    if (existing == null) return NotFound();

    var department = await _context.Departments
        .FirstOrDefaultAsync(d => d.Name.ToLower() == dto.Department.ToLower());

    if (department == null)
        return BadRequest("Invalid department");

    existing.Name = dto.Name;
    existing.Email = dto.Email;
    existing.Phone = dto.Phone;
    existing.DepartmentId = department.Id;

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