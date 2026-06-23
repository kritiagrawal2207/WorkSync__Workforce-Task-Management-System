using WorkSyncAPI.DTOs;
using WorkSyncAPI.Models;
using WorkSyncAPI.Repositories.Interfaces;
using WorkSyncAPI.Services.Interfaces;
 
namespace WorkSyncAPI.Services.Implementations;
 
public class TaskService : ITaskService
{
    private readonly ITaskRepository _repo;
 
    public TaskService(ITaskRepository repo)
    {
        _repo = repo;
    }
 
    public Task<List<TaskItem>> GetAllAsync()
        => _repo.GetAllAsync();
 
    public Task<TaskItem?> GetByIdWithDetailsAsync(int id)
        => _repo.GetByIdWithDetailsAsync(id);
 
    public Task<List<TaskItem>> GetByEmployeeIdAsync(int employeeId)
        => _repo.GetByEmployeeIdAsync(employeeId);
 
    public async Task<TaskItem> CreateAsync(TaskCreateDto dto)
    {
        var task = new TaskItem
        {
            Title = dto.Title,
            Description = dto.Description,
            Priority = dto.Priority,
            Status = dto.Status,
            CreatedByUserId = dto.CreatedByUserId,
            DueDate = dto.DueDate,
            CreatedAt = DateTime.UtcNow
        };
 
        await _repo.AddAsync(task);
        await _repo.SaveAsync();
 
        return task;
    }
 
    public async Task<(bool Success, string Message, TaskItem? Task)> UpdateAsync(int id, TaskCreateDto dto)
    {
        var task = await _repo.GetByIdAsync(id);
        if (task == null)
            return (false, "Task not found", null);
 
        task.Title = dto.Title;
        task.Description = dto.Description;
        task.Priority = dto.Priority;
        task.DueDate = dto.DueDate;
 
        await _repo.SaveAsync();
 
        return (true, "Task updated", task);
    }
 
    public async Task<(bool Success, string Message)> DeleteAsync(int id)
    {
        var task = await _repo.GetByIdAsync(id);
        if (task == null)
            return (false, "Task not found");
 
        await _repo.DeleteAsync(task);
        await _repo.SaveAsync();
 
        return (true, "Task deleted");
    }
 
    public async Task<(bool Success, string Message, TaskItem? Task)> UpdateStatusAsync(int id, TaskStatusUpdateDto dto)
    {
        var task = await _repo.GetByIdAsync(id);
        if (task == null)
            return (false, "Task not found", null);
 
        task.Status = dto.Status;
        await _repo.SaveAsync();
 
        return (true, "Status updated", task);
    }
 
    public async Task<TaskAssignment> AssignAsync(TaskAssignDto dto)
    {
        var assignment = new TaskAssignment
        {
            TaskId = dto.TaskId,
            EmployeeId = dto.EmployeeId,
            AssignedAt = DateTime.UtcNow
        };
 
        await _repo.AssignAsync(assignment);
        await _repo.SaveAsync();
 
        return assignment;
    }
 
    public async Task<TaskComment> AddCommentAsync(TaskCommentCreateDto dto)
    {
        var comment = new TaskComment
        {
            TaskId = dto.TaskId,
            UserId = dto.UserId,
            Content = dto.Content,
            CreatedAt = DateTime.UtcNow
        };
 
        await _repo.AddCommentAsync(comment);
        await _repo.SaveAsync();
 
        return comment;
    }
}