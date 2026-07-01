using WorkSyncAPI.DTOs;
using WorkSyncAPI.Models;
using WorkSyncAPI.Repositories.Interfaces;
using WorkSyncAPI.Services.Interfaces;

namespace WorkSyncAPI.Services.Implementations
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;
        public EmployeeService(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }
        public async Task<IEnumerable<EmployeeResponseDto>> GetAllEmployeesAsync()
        {
            var employees = await _employeeRepository.GetAllAsync();
            return employees.Select(e => MapToResponseDto(e));
        }
        public async Task<EmployeeResponseDto?> GetEmployeeByIdAsync(int id)
        {
            var employee = await _employeeRepository.GetByIdAsync(id);
            if (employee == null) return null;
            return MapToResponseDto(employee);
        }
        public async Task<EmployeeResponseDto> CreateEmployeeAsync(EmployeeCreateDto dto)
        {
            var existing = await _employeeRepository.GetByEmailAsync(dto.Email);
            if (existing != null)
                throw new InvalidOperationException($"Employee with email '{dto.Email}' already exists.");
            var employee = new Employee
            {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                DepartmentId = dto.DepartmentId
            };
            var created = await _employeeRepository.CreateAsync(employee);
            var createdWithDept = await _employeeRepository.GetByIdAsync(created.Id);
            return MapToResponseDto(createdWithDept!);
        }
        public async Task<EmployeeResponseDto?> UpdateEmployeeAsync(int id, EmployeeCreateDto dto)
        {
            var employee = await _employeeRepository.GetByIdAsync(id);
            if (employee == null) return null;
            var existing = await _employeeRepository.GetByEmailAsync(dto.Email);
            if (existing != null && existing.Id != id)
                throw new InvalidOperationException($"Email '{dto.Email}' is already used by another employee.");
            employee.Name = dto.Name;
            employee.Email = dto.Email;
            employee.Phone = dto.Phone;
            employee.DepartmentId = dto.DepartmentId;
            var updated = await _employeeRepository.UpdateAsync(employee);
            var updatedWithDept = await _employeeRepository.GetByIdAsync(updated.Id);
            return MapToResponseDto(updatedWithDept!);
        }
        public async Task<bool> DeleteEmployeeAsync(int id)
        {
            return await _employeeRepository.DeleteAsync(id);
        }
        private EmployeeResponseDto MapToResponseDto(Employee employee)
        {
            return new EmployeeResponseDto
            {
                Id = employee.Id,
                Name = employee.Name,
                Email = employee.Email,
                Phone = employee.Phone,
                DepartmentId = employee.DepartmentId,
                DepartmentName = employee.Department?.Name ?? "Unknown"
            };
        }
    }
}