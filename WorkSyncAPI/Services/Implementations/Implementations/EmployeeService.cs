using Microsoft.EntityFrameworkCore;
using WorkSyncAPI.Data;
using WorkSyncAPI.DTOs;
using WorkSyncAPI.Models;
using WorkSyncAPI.Repositories.Interfaces;
using WorkSyncAPI.Services.Interfaces;
 
namespace WorkSyncAPI.Services.Implementations;
 
public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _repo;
    private readonly ApplicationDbContext _context;
 
    public EmployeeService(IEmployeeRepository repo, ApplicationDbContext context)
    {
        _repo = repo;
        _context = context;
    }
 
    public Task<List<Employee>> GetAllEmployeesAsync()
        => _repo.GetAllAsync();
 
    public Task<Employee?> GetEmployeeByIdAsync(int id)
        => _repo.GetByIdAsync(id);
 
    public async Task<(bool Success, string Message, Employee? Employee)> CreateEmployeeAsync(EmployeeCreateDto dto)
    {
        // ✅ Business logic — duplicate email check
        if (await _repo.EmailExistsAsync(dto.Email))
            return (false, "Employee already exists with this email", null);
 
        // ✅ Business logic — department validation
        var department = await _context.Departments
            .FirstOrDefaultAsync(d => d.Name.ToLower() == dto.Department.ToLower());
 
        if (department == null)
            return (false, "Invalid department", null);
 
        var employee = new Employee
        {
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            DepartmentId = department.Id
        };
 
        await _repo.AddAsync(employee);
        await _repo.SaveAsync();
 
        return (true, "Employee created successfully", employee);
    }
 
    public async Task<(bool Success, string Message, Employee? Employee)> UpdateEmployeeAsync(int id, EmployeeCreateDto dto)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null)
            return (false, "Employee not found", null);
 
        // ✅ Business logic — department validation
        var department = await _context.Departments
            .FirstOrDefaultAsync(d => d.Name.ToLower() == dto.Department.ToLower());
 
        if (department == null)
            return (false, "Invalid department", null);
 
        existing.Name = dto.Name;
        existing.Email = dto.Email;
        existing.Phone = dto.Phone;
        existing.DepartmentId = department.Id;
 
        await _repo.UpdateAsync(existing);
        await _repo.SaveAsync();
 
        return (true, "Employee updated successfully", existing);
    }
 
    public async Task<(bool Success, string Message)> DeleteEmployeeAsync(int id)
    {
        var emp = await _repo.GetByIdAsync(id);
        if (emp == null)
            return (false, "Employee not found");
 
        await _repo.DeleteAsync(emp);
        await _repo.SaveAsync();
 
        return (true, "Employee Deleted");
    }
}