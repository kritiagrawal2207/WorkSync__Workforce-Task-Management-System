using Microsoft.AspNetCore.Mvc;
using WorkSyncAPI.DTOs;
using WorkSyncAPI.Services.Interfaces;
namespace WorkSyncAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        public EmployeesController(IEmployeeService employeeService)
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
            var employee = await _employeeService.GetEmployeeByIdAsync(id);
            if (employee == null)
                return NotFound(new { message = $"Employee with id {id} not found." });
            return Ok(employee);
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] EmployeeCreateDto dto)
        {
            try
            {
                var created = await _employeeService.CreateEmployeeAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
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
                var updated = await _employeeService.UpdateEmployeeAsync(id, dto);
                if (updated == null)
                    return NotFound(new { message = $"Employee with id {id} not found." });
                return Ok(updated);
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
                return NotFound(new { message = $"Employee with id {id} not found." });
            return NoContent();
        }
    }
<<<<<<< HEAD

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
=======
}
>>>>>>> week1
