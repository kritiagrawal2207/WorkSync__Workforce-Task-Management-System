using WorkSyncAPI.DTOs.Dashboard;
namespace WorkSyncAPI.Repositories.Interfaces;
public interface IDashboardRepository
{
    Task<int> GetTotalTasksAsync();
    Task<int> GetCompletedTasksAsync();
    Task<int> GetPendingTasksAsync();
    Task<double> GetAttendancePercentageAsync();
    Task<List<EmployeeWorkloadDto>> GetEmployeeWorkloadsAsync();
}