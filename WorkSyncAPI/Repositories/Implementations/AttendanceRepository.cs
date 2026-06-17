using Microsoft.EntityFrameworkCore;
using WorkSyncAPI.Data;
using WorkSyncAPI.Models;
using WorkSyncAPI.Repositories.Interfaces;

namespace WorkSyncAPI.Repositories.Implementations;

public class AttendanceRepository : IAttendanceRepository
{
    private readonly ApplicationDbContext _context;
    public AttendanceRepository(ApplicationDbContext context) => _context = context;

    public Task<List<Attendance>> GetAllAsync() =>
        _context.Attendances.Include(a => a.Employee).ToListAsync();

    public Task<List<Attendance>> GetByEmployeeIdAsync(int employeeId) =>
        _context.Attendances.Where(a => a.EmployeeId == employeeId).ToListAsync();

    public Task<Attendance?> GetByIdAsync(int id) =>
        _context.Attendances.FindAsync(id).AsTask();

    public async Task AddAsync(Attendance attendance) =>
        await _context.Attendances.AddAsync(attendance);

    public Task SaveAsync() => _context.SaveChangesAsync();
}