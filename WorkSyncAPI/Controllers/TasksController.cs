using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkSyncAPI.DTOs;
using WorkSyncAPI.Services.Interfaces;

namespace WorkSyncAPI.Controllers;

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
    public async Task<IActionResult> GetAll() => Ok(await _taskService.GetAllAsync());
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var task = await _taskService.GetByIdWithDetailsAsync(id);
        if (task == null) return NotFound();
        return Ok(task);
    }
    [HttpGet("employee/{employeeId}")]
    public async Task<IActionResult> GetByEmployee(int employeeId) =>
        Ok(await _taskService.GetByEmployeeIdAsync(employeeId));

    [HttpPost]
    public async Task<IActionResult> Create(TaskCreateDto dto)
    {
        var task = await _taskService.CreateAsync(dto);
        return Ok(task);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, TaskCreateDto dto)
    {
        var (success, message, task) = await _taskService.UpdateAsync(id, dto);
        if (!success) return NotFound(message);
        return Ok(task);
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var (success, message) = await _taskService.DeleteAsync(id);
        if (!success) return NotFound(message);
        return NoContent();
    }
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, TaskStatusUpdateDto dto)
    {
        var (success, message, task) = await _taskService.UpdateStatusAsync(id, dto);
        if (!success) return NotFound(message);
        return Ok(task);
    }
    [HttpPost("assign")]
    public async Task<IActionResult> Assign(TaskAssignDto dto)
    {
        var assignment = await _taskService.AssignAsync(dto);
        return Ok(assignment);
    }
    [HttpPost("comment")]
    public async Task<IActionResult> AddComment(TaskCommentCreateDto dto)
    {
        var comment = await _taskService.AddCommentAsync(dto);
        return Ok(comment);
    }
}
