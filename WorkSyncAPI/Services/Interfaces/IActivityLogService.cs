using WorkSyncAPI.DTOs.ActivityLog;
namespace WorkSyncAPI.Services.Interfaces
{
    public interface IActivityLogService
    {
        Task LogAsync(string action, string entityType, int? entityId, string? description, int? userId = null);
        Task<IEnumerable<ActivityLogResponseDto>> GetAllLogsAsync();
        Task<IEnumerable<ActivityLogResponseDto>> GetLogsByUserAsync(int userId);
        Task<IEnumerable<ActivityLogResponseDto>> GetLogsByEntityTypeAsync(string entityType);
    }
}