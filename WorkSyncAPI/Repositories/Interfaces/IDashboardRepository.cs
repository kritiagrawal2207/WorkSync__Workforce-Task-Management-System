using WorkSyncAPI.DTOs.Dashboard;
namespace WorkSyncAPI.Repositories.Interfaces;
public interface IDashboardRepository
{
    Task<int> GetTotalTasksAsync();
    Task<int> GetCompletedTasksAsync();
    Task<int> GetPendingTasksAsync();
    Task<double> GetAttendancePercentageAsync();
    Task<List<EmployeeWorkloadDto>> GetEmployeeWorkloadsAsync();
    Task<int> GetTotalTasksByEmployeeAsync(int employeeId);
    Task<int> GetCompletedTasksByEmployeeAsync(int employeeId);
    Task<int> GetPendingTasksByEmployeeAsync(int employeeId);
    Task<double> GetAttendancePercentageByEmployeeAsync(int employeeId);
}