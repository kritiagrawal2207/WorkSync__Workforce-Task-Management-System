using WorkSyncAPI.Models;

namespace WorkSyncAPI.Repositories.Interfaces;

public interface ITaskRepository
{
    Task<List<TaskItem>> GetAllAsync();
    Task<TaskItem?> GetByIdAsync(int id);
    Task AddAsync(TaskItem task);
    Task AssignAsync(TaskAssignment assignment);
    Task AddCommentAsync(TaskComment comment);
    Task SaveAsync();
}