using Microsoft.EntityFrameworkCore;
using WorkSyncAPI.Data;
using WorkSyncAPI.DTOs.Dashboard;
using WorkSyncAPI.Repositories.Interfaces;
namespace WorkSyncAPI.Repositories.Implementations;
public class DashboardRepository : IDashboardRepository
{
    private readonly ApplicationDbContext _context;
    public DashboardRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    public Task<int> GetTotalTasksAsync()
        => _context.Tasks.CountAsync();
    public Task<int> GetCompletedTasksAsync()
        => _context.Tasks.CountAsync(t => t.Status == "Completed");
    public Task<int> GetPendingTasksAsync()
        => _context.Tasks.CountAsync(t => t.Status != "Completed");
    public async Task<double> GetAttendancePercentageAsync()
    {
        var totalEmployees = await _context.Employees.CountAsync();
        if (totalEmployees == 0) return 0;
        var today = DateTime.UtcNow.Date;
        var presentToday = await _context.Attendances
            .Where(a => a.CheckIn.Date == today && a.Status == "Present")
            .Select(a => a.EmployeeId)
            .Distinct()
            .CountAsync();
        return Math.Round((double)presentToday / totalEmployees * 100, 1);
    }
    public async Task<List<EmployeeWorkloadDto>> GetEmployeeWorkloadsAsync()
    {
        return await _context.TaskAssignments
            .Include(a => a.Employee)
            .GroupBy(a => new { a.EmployeeId, a.Employee!.Name })
            .Select(g => new EmployeeWorkloadDto
            {
                EmployeeId   = g.Key.EmployeeId,
                EmployeeName = g.Key.Name,
                TaskCount    = g.Count()
            })
            .OrderByDescending(w => w.TaskCount)
            .Take(10)
            .ToListAsync();
    }
    public Task<int> GetTotalTasksByEmployeeAsync(int employeeId)
        => _context.TaskAssignments.CountAsync(a => a.EmployeeId == employeeId);

    public Task<int> GetCompletedTasksByEmployeeAsync(int employeeId)
        => _context.TaskAssignments
            .CountAsync(a => a.EmployeeId == employeeId && a.Task!.Status == "Completed");
    public Task<int> GetPendingTasksByEmployeeAsync(int employeeId)
        => _context.TaskAssignments
            .CountAsync(a => a.EmployeeId == employeeId && a.Task!.Status != "Completed");
    public async Task<double> GetAttendancePercentageByEmployeeAsync(int employeeId)
    {
        var today = DateTime.UtcNow.Date;
        var isPresent = await _context.Attendances
            .AnyAsync(a => a.EmployeeId == employeeId
                        && a.CheckIn.Date == today
                        && a.Status == "Present");
        return isPresent ? 100.0 : 0.0;
    }
}