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
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var task = await _repo.GetByIdWithDetailsAsync(id);
        if (task == null) return NotFound();
        return Ok(task);
    }

    [HttpGet("employee/{employeeId}")]
    public async Task<IActionResult> GetByEmployee(int employeeId) =>
        Ok(await _repo.GetByEmployeeIdAsync(employeeId));

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
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, TaskCreateDto dto)
    {
        var task = await _repo.GetByIdAsync(id);
        if (task == null) return NotFound();

        task.Title = dto.Title;
        task.Description = dto.Description;
        task.Priority = dto.Priority;
        task.DueDate = dto.DueDate;
        await _repo.SaveAsync();
        return Ok(task);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var task = await _repo.GetByIdAsync(id);
        if (task == null) return NotFound();

        await _repo.DeleteAsync(task);
        await _repo.SaveAsync();
        return NoContent();
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, TaskStatusUpdateDto dto)
    {
        var task = await _repo.GetByIdAsync(id);
        if (task == null) return NotFound();
        task.Status = dto.Status;
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
