using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkSyncAPI.DTOs.Task;
using WorkSyncAPI.Services.Interfaces;
namespace WorkSyncAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;
        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tasks = await _taskService.GetAllAsync();
            return Ok(tasks.Select(MapToResponse));
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var task = await _taskService.GetByIdWithDetailsAsync(id);
            if (task == null) return NotFound(new { message = "Task not found." });
            return Ok(MapToResponse(task));
        }
        [HttpGet("employee/{employeeId}")]
        public async Task<IActionResult> GetByEmployee(int employeeId)
        {
            var tasks = await _taskService.GetByEmployeeIdAsync(employeeId);
            return Ok(tasks.Select(MapToResponse));
        }
        [HttpPost]
        public async Task<IActionResult> Create(TaskCreateDto dto)
        {
            var task = await _taskService.CreateAsync(dto);
            return Ok(new { message = "Task created.", taskId = task.Id });
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, TaskCreateDto dto)
        {
            var (success, message, task) = await _taskService.UpdateAsync(id, dto);
            if (!success) return NotFound(new { message });
            return Ok(MapToResponse(task!));
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var (success, message) = await _taskService.DeleteAsync(id);
            if (!success) return NotFound(new { message });
            return Ok(new { message });
        }
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, TaskStatusUpdateDto dto)
        {
            var (success, message, task) = await _taskService.UpdateStatusAsync(id, dto);
            if (!success) return NotFound(new { message });
            return Ok(new { message, status = task!.Status });
        }
        [HttpPost("assign")]
        public async Task<IActionResult> Assign(TaskAssignDto dto)
        {
            var assignment = await _taskService.AssignAsync(dto);
            return Ok(new { message = "Task assigned successfully.", assignmentId = assignment.Id });
        }
        [HttpPost("comment")]
        public async Task<IActionResult> AddComment(TaskCommentCreateDto dto)
        {
            var comment = await _taskService.AddCommentAsync(dto);
            return Ok(new TaskCommentResponseDto
            {
                Id        = comment.Id,
                TaskId    = comment.TaskId,
                UserId    = comment.UserId,
                Content   = comment.Content,
                CreatedAt = comment.CreatedAt
            });
        }
        private static TaskResponseDto MapToResponse(WorkSyncAPI.Models.TaskItem t) => new()
        {
            Id            = t.Id,
            Title         = t.Title,
            Description   = t.Description,
            Priority      = t.Priority,
            Status        = t.Status,
            CreatedByUserId = t.CreatedByUserId,
            CreatedByName = t.CreatedBy?.Name ?? "",
            DueDate       = t.DueDate,
            CreatedAt     = t.CreatedAt,
            Assignments   = t.Assignments?.Select(a => new TaskAssignmentResponseDto
            {
                Id           = a.Id,
                TaskId       = a.TaskId,
                EmployeeId   = a.EmployeeId,
                EmployeeName = a.Employee?.Name ?? "",
                AssignedAt   = a.AssignedAt
            }).ToList() ?? new(),
            Comments = t.Comments?.Select(c => new TaskCommentResponseDto
            {
                Id        = c.Id,
                TaskId    = c.TaskId,
                UserId    = c.UserId,
                UserName  = c.User?.Name ?? "",
                Content   = c.Content,
                CreatedAt = c.CreatedAt
            }).ToList() ?? new()
        };
    }
}