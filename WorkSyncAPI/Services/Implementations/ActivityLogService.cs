using WorkSyncAPI.DTOs.ActivityLog;
using WorkSyncAPI.Models;
using WorkSyncAPI.Repositories.Interfaces;
using WorkSyncAPI.Services.Interfaces;
namespace WorkSyncAPI.Services.Implementations
{
    public class ActivityLogService : IActivityLogService
    {
        private readonly IActivityLogRepository _repo;
        public ActivityLogService(IActivityLogRepository repo)
        {
            _repo = repo;
        }
        public async Task LogAsync(string action, string entityType, int? entityId, string? description, int? userId = null)
        {
            var log = new ActivityLog
            {
                Action      = action,
                EntityType  = entityType,
                EntityId    = entityId,
                Description = description,
                UserId      = userId,
                CreatedAt   = DateTime.UtcNow
            };
            await _repo.AddAsync(log);
        }
        public async Task<IEnumerable<ActivityLogResponseDto>> GetAllLogsAsync()
        {
            var logs = await _repo.GetAllAsync();
            return logs.Select(MapToDto);
        }
        public async Task<IEnumerable<ActivityLogResponseDto>> GetLogsByUserAsync(int userId)
        {
            var logs = await _repo.GetByUserIdAsync(userId);
            return logs.Select(MapToDto);
        }
        public async Task<IEnumerable<ActivityLogResponseDto>> GetLogsByEntityTypeAsync(string entityType)
        {
            var logs = await _repo.GetByEntityTypeAsync(entityType);
            return logs.Select(MapToDto);
        }
        private static ActivityLogResponseDto MapToDto(ActivityLog log) => new()
        {
            Id          = log.Id,
            UserId      = log.UserId,
            UserName    = log.User?.Name,
            Action      = log.Action,
            EntityType  = log.EntityType,
            EntityId    = log.EntityId,
            Description = log.Description,
            CreatedAt   = log.CreatedAt
        };
    }
}