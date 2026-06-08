using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkSyncAPI.Data;
using WorkSyncAPI.Models;

namespace WorkSyncAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeeController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public EmployeeController(ApplicationDbContext context)
    {
        _context = context;
    }

   [HttpGet]
public async Task<IActionResult> GetEmployees()
{
    var employees = await _context.Employees.ToListAsync();
    return Ok(employees);
}

    [HttpPost]
    public async Task<IActionResult> AddEmployee(Employee employee)
    {
        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();

        return Ok(employee);
    }
    [HttpGet("{id}")]
    
public async Task<IActionResult> GetEmployee(int id)
{
    var employee = await _context.Employees.FindAsync(id);

    if (employee == null)
    {
        return NotFound();
    }

    return Ok(employee);
}
[HttpPut("{id}")]
public async Task<IActionResult> UpdateEmployee(int id, Employee employee)
{
    if (id != employee.Id)
    {
        return BadRequest();
    }

    _context.Entry(employee).State = EntityState.Modified;

    await _context.SaveChangesAsync();

    return Ok(employee);
}
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteEmployee(int id)
{
    var employee = await _context.Employees.FindAsync(id);

    if (employee == null)
    {
        return NotFound();
    }

    _context.Employees.Remove(employee);

    await _context.SaveChangesAsync();

    return Ok("Employee Deleted");
}
}
