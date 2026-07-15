using Microsoft.EntityFrameworkCore;
using WorkSyncAPI.Data;
using WorkSyncAPI.Models;
using WorkSyncAPI.Repositories.Interfaces;
namespace WorkSyncAPI.Repositories.Implementations;
public class NotificationRepository : INotificationRepository
{
    private readonly ApplicationDbContext _context;
    public NotificationRepository(ApplicationDbContext context)
    {
        _context = context;
    }
 
    public Task<List<Notification>> GetByUserIdAsync(int userId)
        => _context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
 
    public Task<int> GetUnreadCountAsync(int userId)
        => _context.Notifications
            .CountAsync(n => n.UserId == userId && !n.IsRead);
    public async Task<Notification> CreateAsync(Notification notification)
    {
        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();
        return notification;
    }
 
    public async Task<bool> MarkAsReadAsync(int notificationId, int userId)
    {
        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId);
        if (notification == null) return false;
 
        notification.IsRead = true;
        await _context.SaveChangesAsync();
        return true;
    }
 
    public async Task<bool> MarkAllAsReadAsync(int userId)
    {
        var unread = await _context.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToListAsync();
 
        foreach (var n in unread)
            n.IsRead = true;
 
        await _context.SaveChangesAsync();
        return true;
    }
}