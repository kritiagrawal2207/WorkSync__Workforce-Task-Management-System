using WorkSyncAPI.DTOs.Dashboard;
using WorkSyncAPI.Repositories.Interfaces;
using WorkSyncAPI.Services.Interfaces;
namespace WorkSyncAPI.Services.Implementations;
public class DashboardService : IDashboardService
{
    private readonly IDashboardRepository _repo;
    public DashboardService(IDashboardRepository repo)
    {
        _repo = repo;
    }
    public async Task<DashboardSummaryDto> GetSummaryAsync()
    {
        var total      = await _repo.GetTotalTasksAsync();
        var completed  = await _repo.GetCompletedTasksAsync();
        var pending    = await _repo.GetPendingTasksAsync();
        var attendance = await _repo.GetAttendancePercentageAsync();
        var workloads  = await _repo.GetEmployeeWorkloadsAsync();
        return new DashboardSummaryDto
        {
            TotalTasks = total,
            CompletedTasks = completed,
            PendingTasks  = pending,
            AttendancePercentage = attendance,
            EmployeeWorkloads  = workloads
        };
    }
}