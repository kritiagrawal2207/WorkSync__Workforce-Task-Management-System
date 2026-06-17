using Microsoft.EntityFrameworkCore;
using WorkSyncAPI.Data;
using WorkSyncAPI.Models;
using WorkSyncAPI.Repositories.Interfaces;

namespace WorkSyncAPI.Repositories.Implementations;

public class TaskRepository : ITaskRepository
{
    private readonly ApplicationDbContext _context;
    public TaskRepository(ApplicationDbContext context) => _context = context;

    public Task<List<TaskItem>> GetAllAsync() =>
        _context.Tasks
            .Include(t => t.CreatedBy)
            .Include(t => t.Assignments!).ThenInclude(a => a.Employee)
            .Include(t => t.Comments!).ThenInclude(c => c.User)
            .ToListAsync();

    public Task<TaskItem?> GetByIdAsync(int id) =>
        _context.Tasks.FirstOrDefaultAsync(t => t.Id == id);

    public async Task AddAsync(TaskItem task) =>
        await _context.Tasks.AddAsync(task);

    public async Task AssignAsync(TaskAssignment assignment) =>
        await _context.TaskAssignments.AddAsync(assignment);

    public async Task AddCommentAsync(TaskComment comment) =>
        await _context.TaskComments.AddAsync(comment);

    public Task SaveAsync() => _context.SaveChangesAsync();
}