using WorkSyncAPI.DTOs.Notification;
namespace WorkSyncAPI.Services.Interfaces;
public interface INotificationService
{
    Task<List<NotificationResponseDto>> GetByUserIdAsync(int userId);
    Task<int> GetUnreadCountAsync(int userId);
    Task<NotificationResponseDto> CreateAsync(NotificationCreateDto dto);
    Task<bool> MarkAsReadAsync(int notificationId, int userId);
    Task<bool> MarkAllAsReadAsync(int userId);
}