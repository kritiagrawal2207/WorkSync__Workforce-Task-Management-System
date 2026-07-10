using Microsoft.EntityFrameworkCore;
using WorkSyncAPI.Data;
using WorkSyncAPI.Models;
using WorkSyncAPI.Repositories.Interfaces;
namespace WorkSyncAPI.Repositories.Implementations
{
    public class ActivityLogRepository : IActivityLogRepository
    {
        private readonly ApplicationDbContext _context;
        public ActivityLogRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task AddAsync(ActivityLog log)
        {
            _context.ActivityLogs.Add(log);
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<ActivityLog>> GetAllAsync()
        {
            return await _context.ActivityLogs
                .Include(a => a.User)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }
        public async Task<IEnumerable<ActivityLog>> GetByUserIdAsync(int userId)
        {
            return await _context.ActivityLogs
                .Include(a => a.User)
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }
        public async Task<IEnumerable<ActivityLog>> GetByEntityTypeAsync(string entityType)
        {
            return await _context.ActivityLogs
                .Include(a => a.User)
                .Where(a => a.EntityType == entityType)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }
    }
}