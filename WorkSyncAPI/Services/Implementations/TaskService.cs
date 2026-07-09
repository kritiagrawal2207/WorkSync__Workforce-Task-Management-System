using WorkSyncAPI.DTOs.Notification;
using WorkSyncAPI.DTOs.Task;
using WorkSyncAPI.Models;
using WorkSyncAPI.Repositories.Interfaces;
using WorkSyncAPI.Services.Interfaces;
namespace WorkSyncAPI.Services.Implementations
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _repo;
        private readonly INotificationService _notificationService;
        public TaskService(ITaskRepository repo, INotificationService notificationService)
        {
            _repo = repo;
            _notificationService = notificationService;
        }
        public Task<List<TaskItem>> GetAllAsync() => _repo.GetAllAsync();
        public Task<TaskItem?> GetByIdWithDetailsAsync(int id) => _repo.GetByIdWithDetailsAsync(id);
        public Task<List<TaskItem>> GetByEmployeeIdAsync(int employeeId) =>
            _repo.GetByEmployeeIdAsync(employeeId);
        public async Task<TaskItem> CreateAsync(TaskCreateDto dto)
        {
            var task = new TaskItem
            {
                Title           = dto.Title,
                Description     = dto.Description,
                Priority        = dto.Priority,
                Status          = dto.Status,
                CreatedByUserId = dto.CreatedByUserId,
                DueDate         = dto.DueDate,
                CreatedAt       = DateTime.UtcNow
            };
            await _repo.AddAsync(task);
            await _repo.SaveAsync();
            return task;
        }
        public async Task<(bool Success, string Message, TaskItem? Task)> UpdateAsync(int id, TaskCreateDto dto)
        {
            var task = await _repo.GetByIdAsync(id);
            if (task == null) return (false, "Task not found", null);
            task.Title       = dto.Title;
            task.Description = dto.Description;
            task.Priority    = dto.Priority;
            task.Status      = dto.Status;
            task.DueDate     = dto.DueDate;
            await _repo.SaveAsync();
            return (true, "Task updated", task);
        }
        public async Task<(bool Success, string Message)> DeleteAsync(int id)
        {
            var task = await _repo.GetByIdWithDetailsAsync(id);
            if (task == null) return (false, "Task not found");
            if (task.Assignments?.Any() == true)
                await _repo.DeleteAssignmentsAsync(task.Assignments);
            if (task.Comments?.Any() == true)
                await _repo.DeleteCommentsAsync(task.Comments);
            await _repo.DeleteAsync(task);
            await _repo.SaveAsync();
            return (true, "Task deleted");
        }
        public async Task<(bool Success, string Message, TaskItem? Task)> UpdateStatusAsync(int id, TaskStatusUpdateDto dto)
        {
            var task = await _repo.GetByIdAsync(id);
            if (task == null) return (false, "Task not found", null);
            task.Status = dto.Status;
            await _repo.SaveAsync();
            await _notificationService.CreateAsync(new NotificationCreateDto
            {
                UserId  = task.CreatedByUserId,
                Type    = "Task Status Changed",
                Message = $"Task \"{task.Title}\" has been updated to {dto.Status}."
            });
            return (true, "Status updated", task);
        }
        public async Task<TaskAssignment> AssignAsync(TaskAssignDto dto)
        {
            var assignment = new TaskAssignment
            {
                TaskId     = dto.TaskId,
                EmployeeId = dto.EmployeeId,
                AssignedAt = DateTime.UtcNow
            };
            await _repo.AssignAsync(assignment);
            await _repo.SaveAsync();
            if (dto.AssignedUserId.HasValue)
            {
                var task = await _repo.GetByIdAsync(dto.TaskId);
                await _notificationService.CreateAsync(new NotificationCreateDto
                {
                    UserId  = dto.AssignedUserId.Value,
                    Type    = "Task Assigned",
                    Message = $"You have been assigned task: \"{task?.Title ?? "a new task"}\"."
                });
            }
            return assignment;
        }
        public async Task<(bool Success, string Message)> UnassignAsync(int assignmentId)
        {
            var assignment = await _repo.GetAssignmentAsync(assignmentId);
            if (assignment == null) return (false, "Assignment not found");
            await _repo.DeleteAssignmentAsync(assignment);
            await _repo.SaveAsync();
            return (true, "Assignment removed");
        }
        public async Task<TaskComment> AddCommentAsync(TaskCommentCreateDto dto)
        {
            var comment = new TaskComment
            {
                TaskId    = dto.TaskId,
                UserId    = dto.UserId,
                Content   = dto.Content,
                CreatedAt = DateTime.UtcNow
            };
            await _repo.AddCommentAsync(comment);
            await _repo.SaveAsync();
            return comment;
        }
    }
}