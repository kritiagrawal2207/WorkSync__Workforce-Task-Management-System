using WorkSyncAPI.DTOs.Task;
using WorkSyncAPI.Models;

namespace WorkSyncAPI.Services.Interfaces
{
    public interface ITaskService
    {
        Task<List<TaskItem>> GetAllAsync();
        Task<TaskItem?> GetByIdWithDetailsAsync(int id);
        Task<List<TaskItem>> GetByEmployeeIdAsync(int employeeId);
        Task<TaskItem> CreateAsync(TaskCreateDto dto);
        Task<(bool Success, string Message, TaskItem? Task)> UpdateAsync(int id, TaskCreateDto dto);
        Task<(bool Success, string Message)> DeleteAsync(int id);
        Task<(bool Success, string Message, TaskItem? Task)> UpdateStatusAsync(int id, TaskStatusUpdateDto dto);
        Task<TaskAssignment> AssignAsync(TaskAssignDto dto);
        Task<TaskComment> AddCommentAsync(TaskCommentCreateDto dto);
    }
}