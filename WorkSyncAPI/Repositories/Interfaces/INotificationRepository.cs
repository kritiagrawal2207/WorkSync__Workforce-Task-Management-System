using WorkSyncAPI.Models;
namespace WorkSyncAPI.Repositories.Interfaces;
public interface INotificationRepository
{
    Task<List<Notification>> GetByUserIdAsync(int userId);
    Task<int> GetUnreadCountAsync(int userId);
    Task<Notification> CreateAsync(Notification notification);
    Task<bool> MarkAsReadAsync(int notificationId, int userId);
    Task<bool> MarkAllAsReadAsync(int userId);
}