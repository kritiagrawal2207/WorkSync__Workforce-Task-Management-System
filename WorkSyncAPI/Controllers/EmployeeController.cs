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
         var data = await _context.Employees
        .Include(e => e.Department)  
        .ToListAsync();
        return Ok(data);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetEmployee(int id)
    {
        var emp = await _context.Employees
        .Include(e => e.Department)  
        .FirstOrDefaultAsync(e => e.Id == id);
        if (emp == null)
        {
            return NotFound();
        }
        return Ok(emp);
    }

    [HttpPost]
    public async Task<IActionResult> AddEmployee(Employee employee)
    {
        var emailExists = await _context.Employees
            .FirstOrDefaultAsync(e => e.Email == employee.Email);
        if (emailExists != null)
        {
            return BadRequest("Employee already exists with this email");
        }
        var phoneExists = await _context.Employees
            .FirstOrDefaultAsync(e => e.Phone == employee.Phone);
        if (phoneExists != null)
        {
            return BadRequest("Employee already exists with this phone number");
        }

        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();
        return Ok(employee);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEmployee(int id, Employee employee)
    {
        if (id != employee.Id)
        {
            return BadRequest();
        }
        var emailExists = await _context.Employees
            .FirstOrDefaultAsync(e => e.Email == employee.Email && e.Id != id);
        if (emailExists != null)
        {
            return BadRequest("Employee already exists with this email");
        }
        var phoneExists = await _context.Employees
            .FirstOrDefaultAsync(e => e.Phone == employee.Phone && e.Id != id);
        if (phoneExists != null)
        {
            return BadRequest("Employee already exists with this phone number");
        }

        _context.Entry(employee).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return Ok(employee);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEmployee(int id)
    {
        var emp = await _context.Employees.FindAsync(id);
        if (emp == null)
        {
            return NotFound();
        }
        _context.Employees.Remove(emp);
        await _context.SaveChangesAsync();
        return Ok("Employee Deleted");
    }
}
