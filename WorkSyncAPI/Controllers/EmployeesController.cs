using WorkSyncAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkSyncAPI.Services.Interfaces;

namespace WorkSyncAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmployeeController : ControllerBase
{
   private readonly IEmployeeService _employeeService;

    public EmployeeController(IEmployeeService employeeService)
    {
        _employeeService = employeeService;
    }

    [HttpGet]
     public async Task<IActionResult> GetAll() => Ok(await _employeeService.GetAllEmployeesAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var emp = await _employeeService.GetEmployeeByIdAsync(id);
        return emp == null ? NotFound() : Ok(emp);
    }

   [HttpPost]
public async Task<IActionResult> Add([FromBody] EmployeeCreateDto dto)
{
    var (success, message, employee) = await _employeeService.CreateEmployeeAsync(dto);
        if (!success) return BadRequest(message);
        return Ok(employee);
}

   [HttpPut("{id}")]
public async Task<IActionResult> Update(int id, [FromBody] EmployeeCreateDto dto)
{
   var (success, message, employee) = await _employeeService.UpdateEmployeeAsync(id, dto);
        if (!success) return message == "Employee not found" ? NotFound() : BadRequest(message);
        return Ok(employee);
}

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var (success, message) = await _employeeService.DeleteEmployeeAsync(id);
        if (!success) return NotFound(message);
        return Ok(message);
    }
    
}