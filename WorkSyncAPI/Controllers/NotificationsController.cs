using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkSyncAPI.DTOs.Notification;
using WorkSyncAPI.Services.Interfaces;
namespace WorkSyncAPI.Controllers;
 
[Route("api/[controller]")]
[ApiController]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notificationService;
 
    public NotificationsController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetByUser(int userId)
    {
        var notifications = await _notificationService.GetByUserIdAsync(userId);
        return Ok(notifications);
    }
    [HttpGet("{userId}/unread-count")]
    public async Task<IActionResult> GetUnreadCount(int userId)
    {
        var count = await _notificationService.GetUnreadCountAsync(userId);
        return Ok(new { unreadCount = count });
    }
    [HttpPost]
    public async Task<IActionResult> Create(NotificationCreateDto dto)
    {
        var notification = await _notificationService.CreateAsync(dto);
        return Ok(notification);
    }
 
    // PUT api/notifications/{id}/read
    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();
 
        var success = await _notificationService.MarkAsReadAsync(id, userId.Value);
        if (!success) return NotFound(new { message = "Notification not found." });
        return Ok(new { message = "Marked as read." });
    }
    [HttpPut("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();
 
        await _notificationService.MarkAllAsReadAsync(userId.Value);
        return Ok(new { message = "All notifications marked as read." });
    }
    private int? GetCurrentUserId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(claim, out var id) ? id : null;
    }
}