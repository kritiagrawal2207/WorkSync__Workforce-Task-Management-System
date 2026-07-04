using WorkSyncAPI.DTOs.Attendance;
using WorkSyncAPI.Models;
using WorkSyncAPI.Repositories.Interfaces;
using WorkSyncAPI.Services.Interfaces;
namespace WorkSyncAPI.Services.Implementations
{
    public class AttendanceService : IAttendanceService
    {
        private readonly IAttendanceRepository _repo;
        public AttendanceService(IAttendanceRepository repo)
        {
            _repo = repo;
        }
        public Task<List<Attendance>> GetAllAsync() => _repo.GetAllAsync();
        public Task<List<Attendance>> GetByEmployeeIdAsync(int employeeId) =>
            _repo.GetByEmployeeIdAsync(employeeId);
        public Task<Attendance?> GetTodayByEmployeeIdAsync(int employeeId) =>
            _repo.GetTodayByEmployeeIdAsync(employeeId);
        public async Task<Attendance> CreateAsync(AttendanceCreateDto dto)
        {
            var attendance = new Attendance
            {
                EmployeeId = dto.EmployeeId,
                CheckIn    = dto.CheckIn,
                CheckOut   = dto.CheckOut,
                Status     = dto.Status
            };
            await _repo.AddAsync(attendance);
            await _repo.SaveAsync();
            return attendance;
        }
        public async Task<(bool Success, string Message, Attendance? Attendance)> CheckOutAsync(int id, AttendanceUpdateDto dto)
        {
            var attendance = await _repo.GetByIdAsync(id);
            if (attendance == null)
                return (false, "Attendance record not found", null);
            attendance.CheckOut = dto.CheckOut;
            attendance.Status   = dto.Status;
            await _repo.SaveAsync();
            return (true, "Checked out successfully", attendance);
        }
    }
}