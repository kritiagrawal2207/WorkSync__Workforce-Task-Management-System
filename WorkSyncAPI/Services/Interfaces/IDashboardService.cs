using WorkSyncAPI.DTOs.Dashboard;
namespace WorkSyncAPI.Services.Interfaces;
public interface IDashboardService
{
    Task<DashboardSummaryDto> GetSummaryAsync();
    Task<DashboardSummaryDto> GetEmployeeSummaryAsync(int employeeId);
}