using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkSyncAPI.Services.Interfaces;
namespace WorkSyncAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ActivityLogController : ControllerBase
    {
        private readonly IActivityLogService _logService;
        public ActivityLogController(IActivityLogService logService)
        {
            _logService = logService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var logs = await _logService.GetAllLogsAsync();
            return Ok(logs);
        }
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var logs = await _logService.GetLogsByUserAsync(userId);
            return Ok(logs);
        }
        [HttpGet("type/{entityType}")]
        public async Task<IActionResult> GetByType(string entityType)
        {
            var logs = await _logService.GetLogsByEntityTypeAsync(entityType);
            return Ok(logs);
        }
    }
}