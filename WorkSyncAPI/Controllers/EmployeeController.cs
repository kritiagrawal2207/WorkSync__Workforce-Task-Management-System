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
        var data = await _context.Employees.ToListAsync();
        return Ok(data);
    }
    [HttpPost]
    public async Task<IActionResult> AddEmployee(Employee employee)
    {
        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();
        return Ok(employee);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetEmployee(int id){
 var emp = await _context.Employees.FindAsync(id);
  if (emp == null)
        {
         return NotFound();
        }
     return Ok(emp);
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