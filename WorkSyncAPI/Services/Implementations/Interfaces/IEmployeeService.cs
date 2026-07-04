using WorkSyncAPI.DTOs;
using WorkSyncAPI.Models;
 
namespace WorkSyncAPI.Services.Interfaces;
 
public interface IEmployeeService
{
    Task<List<Employee>> GetAllEmployeesAsync();
    Task<Employee?> GetEmployeeByIdAsync(int id);
    Task<(bool Success, string Message, Employee? Employee)> CreateEmployeeAsync(EmployeeCreateDto dto);
    Task<(bool Success, string Message, Employee? Employee)> UpdateEmployeeAsync(int id, EmployeeCreateDto dto);
    Task<(bool Success, string Message)> DeleteEmployeeAsync(int id);
}
