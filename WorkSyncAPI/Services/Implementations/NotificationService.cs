using WorkSyncAPI.DTOs.Notification;
using WorkSyncAPI.Models;
using WorkSyncAPI.Repositories.Interfaces;
using WorkSyncAPI.Services.Interfaces;
namespace WorkSyncAPI.Services.Implementations;
public class NotificationService : INotificationService
{
    private readonly INotificationRepository _repo;
    public NotificationService(INotificationRepository repo)
    {
        _repo = repo;
    }
    public async Task<List<NotificationResponseDto>> GetByUserIdAsync(int userId)
    {
        var list = await _repo.GetByUserIdAsync(userId);
        return list.Select(MapToDto).ToList();
    }
    public Task<int> GetUnreadCountAsync(int userId)
        => _repo.GetUnreadCountAsync(userId);
 
    public async Task<NotificationResponseDto> CreateAsync(NotificationCreateDto dto)
    {
        var notification = new Notification
        {
            UserId    = dto.UserId,
            Title     = dto.Title,
            Message   = dto.Message,
            IsRead    = false,
            CreatedAt = DateTime.UtcNow
        };
        var created = await _repo.CreateAsync(notification);
        return MapToDto(created);
    }
    public Task<bool> MarkAsReadAsync(int notificationId, int userId)
        => _repo.MarkAsReadAsync(notificationId, userId);
 
    public Task<bool> MarkAllAsReadAsync(int userId)
        => _repo.MarkAllAsReadAsync(userId);
 
    private static NotificationResponseDto MapToDto(Notification n) => new()
    {
        Id        = n.Id,
        UserId    = n.UserId,
        Title     = n.Title,
        Message   = n.Message,
        IsRead    = n.IsRead,
        CreatedAt = n.CreatedAt
    };
}