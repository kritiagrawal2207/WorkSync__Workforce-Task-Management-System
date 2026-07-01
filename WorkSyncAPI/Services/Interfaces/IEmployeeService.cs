using WorkSyncAPI.DTOs;

namespace WorkSyncAPI.Services.Interfaces
{
    public interface IEmployeeService
    {
        Task<IEnumerable<EmployeeResponseDto>> GetAllEmployeesAsync();
        Task<EmployeeResponseDto?> GetEmployeeByIdAsync(int id);
        Task<EmployeeResponseDto> CreateEmployeeAsync(EmployeeCreateDto dto);
        Task<EmployeeResponseDto?> UpdateEmployeeAsync(int id, EmployeeCreateDto dto);
        Task<bool> DeleteEmployeeAsync(int id);
    }
}