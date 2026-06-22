using WorkSyncAPI.Models;

namespace WorkSyncAPI.Repositories.Interfaces;

public interface ITaskRepository
{
    Task<List<TaskItem>> GetAllAsync();
    Task<TaskItem?> GetByIdAsync(int id);
    Task<TaskItem?> GetByIdWithDetailsAsync(int id);
    Task<List<TaskItem>> GetByEmployeeIdAsync(int employeeId);

    Task AddAsync(TaskItem task);
    Task DeleteAsync(TaskItem task);
    Task AssignAsync(TaskAssignment assignment);
    Task AddCommentAsync(TaskComment comment);
    Task SaveAsync();
}