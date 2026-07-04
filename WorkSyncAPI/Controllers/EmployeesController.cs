using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkSyncAPI.DTOs;
using WorkSyncAPI.Services.Interfaces;

namespace WorkSyncAPI.Controllers
{
    [ApiController]
    [Route("api/employee")]
    [Authorize]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
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
    }
}