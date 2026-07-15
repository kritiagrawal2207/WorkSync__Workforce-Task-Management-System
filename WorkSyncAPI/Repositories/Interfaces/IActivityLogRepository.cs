using WorkSyncAPI.Models;
namespace WorkSyncAPI.Repositories.Interfaces
{
    public interface IActivityLogRepository
    {
        Task AddAsync(ActivityLog log);
        Task<IEnumerable<ActivityLog>> GetAllAsync();
        Task<IEnumerable<ActivityLog>> GetByUserIdAsync(int userId);
        Task<IEnumerable<ActivityLog>> GetByEntityTypeAsync(string entityType);
    }
}