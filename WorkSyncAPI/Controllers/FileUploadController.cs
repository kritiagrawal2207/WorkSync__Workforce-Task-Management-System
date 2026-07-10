using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkSyncAPI.Data;
using WorkSyncAPI.Models;
using WorkSyncAPI.Services.Interfaces;
namespace WorkSyncAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FileUploadController : ControllerBase
    {
        private readonly IWebHostEnvironment  _env;
        private readonly IActivityLogService  _logService;
        private readonly ApplicationDbContext _context;
        public FileUploadController(
            IWebHostEnvironment env,
            IActivityLogService logService,
            ApplicationDbContext context)
        {
            _env        = env;
            _logService = logService;
            _context    = context;
        }
        [HttpPost("task/{taskId}")]
        public async Task<IActionResult> UploadForTask(int taskId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file provided." });
            var allowed = new[] { ".jpg", ".jpeg", ".png", ".gif", ".pdf",
                                   ".doc", ".docx", ".xls", ".xlsx", ".txt", ".csv" };
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowed.Contains(ext))
                return BadRequest(new { message = $"File type '{ext}' not allowed." });
            if (file.Length > 10 * 1024 * 1024)
                return BadRequest(new { message = "File size exceeds 10MB." });
            var taskExists = await _context.Tasks.AnyAsync(t => t.Id == taskId);
            if (!taskExists)
                return NotFound(new { message = "Task not found." });
            var folder = Path.Combine(_env.ContentRootPath, "Uploads", "tasks", taskId.ToString());
            Directory.CreateDirectory(folder);
            var uniqueName = $"{Guid.NewGuid()}{ext}";
            var filePath   = Path.Combine(folder, uniqueName);
            using (var stream = new FileStream(filePath, FileMode.Create))
                await file.CopyToAsync(stream);
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            int? userId     = userIdClaim != null ? int.Parse(userIdClaim) : null;
            var taskFile = new TaskFile
            {
                TaskId       = taskId,
                FileName     = uniqueName,
                OriginalName = file.FileName,
                FileSize     = file.Length,
                UploadedBy   = userId,
                UploadedAt   = DateTime.UtcNow
            };
            _context.TaskFiles.Add(taskFile);
            await _context.SaveChangesAsync();
            await _logService.LogAsync(
                action:      "FileUploaded",
                entityType:  "Task",
                entityId:    taskId,
                description: $"File '{file.FileName}' uploaded to Task {taskId}",
                userId:      userId
            );
            return Ok(new
            {
                id           = taskFile.Id,
                taskId       = taskId,
                fileName     = uniqueName,
                originalName = file.FileName,
                fileSize     = file.Length,
                uploadedAt   = taskFile.UploadedAt,
                previewUrl   = $"/api/fileupload/task/{taskId}/preview/{uniqueName}",
                downloadUrl  = $"/api/fileupload/task/{taskId}/download/{uniqueName}"
            });
        }
        [HttpGet("task/{taskId}/files")]
        public async Task<IActionResult> GetTaskFiles(int taskId)
        {
            var files = await _context.TaskFiles
                .Where(f => f.TaskId == taskId)
                .OrderByDescending(f => f.UploadedAt)
                .Select(f => new
                {
                    id           = f.Id,
                    taskId       = f.TaskId,
                    fileName     = f.FileName,
                    originalName = f.OriginalName,
                    fileSize     = f.FileSize,
                    uploadedAt   = f.UploadedAt,
                    previewUrl   = $"/api/fileupload/task/{taskId}/preview/{f.FileName}",
                    downloadUrl  = $"/api/fileupload/task/{taskId}/download/{f.FileName}"
                })
                .ToListAsync();

            return Ok(files);
        }
        [HttpGet("task/{taskId}/preview/{fileName}")]
        public IActionResult Preview(int taskId, string fileName)
        {
            var filePath = Path.Combine(_env.ContentRootPath, "Uploads", "tasks", taskId.ToString(), fileName);
            if (!System.IO.File.Exists(filePath))
                return NotFound(new { message = "File not found." });
            var contentType = GetContentType(Path.GetExtension(fileName));
            var stream      = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            Response.Headers["Content-Disposition"] = $"inline; filename=\"{fileName}\"";
            return File(stream, contentType);
        }
        [HttpGet("task/{taskId}/download/{fileName}")]
        public IActionResult Download(int taskId, string fileName)
        {
            var filePath = Path.Combine(_env.ContentRootPath, "Uploads", "tasks", taskId.ToString(), fileName);
            if (!System.IO.File.Exists(filePath))
                return NotFound(new { message = "File not found." });
            var contentType = GetContentType(Path.GetExtension(fileName));
            var bytes       = System.IO.File.ReadAllBytes(filePath);
            return File(bytes, contentType, fileName);
        }
        [HttpDelete("task/{taskId}/file/{fileId}")]
        public async Task<IActionResult> DeleteFile(int taskId, int fileId)
        {
            var record = await _context.TaskFiles
                .FirstOrDefaultAsync(f => f.Id == fileId && f.TaskId == taskId);
            if (record == null)
                return NotFound(new { message = "File not found." });
            var filePath = Path.Combine(_env.ContentRootPath, "Uploads", "tasks", taskId.ToString(), record.FileName);
            if (System.IO.File.Exists(filePath))
                System.IO.File.Delete(filePath);
            _context.TaskFiles.Remove(record);
            await _context.SaveChangesAsync();
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            int? userId     = userIdClaim != null ? int.Parse(userIdClaim) : null;
            await _logService.LogAsync(
                action:      "FileDeleted",
                entityType:  "Task",
                entityId:    taskId,
                description: $"File '{record.OriginalName}' deleted from Task {taskId}",
                userId:      userId
            );
            return Ok(new { message = "File deleted." });
        }
        private static string GetContentType(string ext) => ext.ToLower() switch
        {
            ".pdf"  => "application/pdf",
            ".jpg"  => "image/jpeg",
            ".jpeg" => "image/jpeg",
            ".png"  => "image/png",
            ".gif"  => "image/gif",
            ".doc"  => "application/msword",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".xls"  => "application/vnd.ms-excel",
            ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ".txt"  => "text/plain",
            ".csv"  => "text/csv",
            _       => "application/octet-stream"
        };
    }
}