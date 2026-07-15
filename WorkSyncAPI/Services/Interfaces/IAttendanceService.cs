using WorkSyncAPI.DTOs.Attendance;
using WorkSyncAPI.Models;
namespace WorkSyncAPI.Services.Interfaces
{
    public interface IAttendanceService
    {
        Task<List<Attendance>> GetAllAsync();
        Task<List<Attendance>> GetByEmployeeIdAsync(int employeeId);
        Task<Attendance?> GetTodayByEmployeeIdAsync(int employeeId);
        Task<Attendance> CreateAsync(AttendanceCreateDto dto);
        Task<(bool Success, string Message, Attendance? Attendance)> CheckOutAsync(int id, AttendanceUpdateDto dto);
    }
}