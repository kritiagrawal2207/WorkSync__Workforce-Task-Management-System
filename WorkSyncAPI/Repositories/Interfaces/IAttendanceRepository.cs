using WorkSyncAPI.Models;

namespace WorkSyncAPI.Repositories.Interfaces;

public interface IAttendanceRepository
{
    Task<List<Attendance>> GetAllAsync();
    Task<List<Attendance>> GetByEmployeeIdAsync(int employeeId);
    Task<Attendance?> GetByIdAsync(int id);
    Task AddAsync(Attendance attendance);
    Task SaveAsync();
}