using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkSyncAPI.DTOs;
using WorkSyncAPI.Models;
using WorkSyncAPI.Repositories.Interfaces;

namespace WorkSyncAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ITaskRepository _repo;
    public TasksController(ITaskRepository repo) => _repo = repo;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _repo.GetAllAsync());

    [HttpPost]
    public async Task<IActionResult> Create(TaskCreateDto dto)
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
        return Ok(task);
    }

    [HttpPost("assign")]
    public async Task<IActionResult> Assign(TaskAssignDto dto)
    {
        var assignment = new TaskAssignment
        {
            TaskId = dto.TaskId,
            EmployeeId = dto.EmployeeId,
            AssignedAt = DateTime.UtcNow
        };
        await _repo.AssignAsync(assignment);
        await _repo.SaveAsync();
        return Ok(assignment);
    }

    [HttpPost("comment")]
    public async Task<IActionResult> AddComment(TaskCommentCreateDto dto)
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
        return Ok(comment);
    }
}
