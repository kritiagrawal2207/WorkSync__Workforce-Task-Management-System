using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkSyncAPI.Services.Interfaces;
namespace WorkSyncAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FileUploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly IActivityLogService _logService;
        public FileUploadController(IWebHostEnvironment env, IActivityLogService logService)
        {
            _env        = env;
            _logService = logService;
        }
        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file, [FromQuery] string category = "general")
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file provided." });
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt", ".csv" };
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(ext))
                return BadRequest(new { message = $"File type '{ext}' is not allowed." });
            if (file.Length > 10 * 1024 * 1024)
                return BadRequest(new { message = "File size exceeds 10MB limit." });
            var uploadFolder = Path.Combine(_env.ContentRootPath, "Uploads", category);
            Directory.CreateDirectory(uploadFolder);
            var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
            var filePath       = Path.Combine(uploadFolder, uniqueFileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            int? userId     = userIdClaim != null ? int.Parse(userIdClaim) : null;
            await _logService.LogAsync(
                action:      "FileUploaded",
                entityType:  "File",
                entityId:    null,
                description: $"File '{file.FileName}' uploaded to category '{category}'",
                userId:      userId
            );
            return Ok(new
            {
                message      = "File uploaded successfully.",
                fileName     = uniqueFileName,
                originalName = file.FileName,
                category     = category,
                size         = file.Length,
                path         = $"/Uploads/{category}/{uniqueFileName}"
            });
        }
        [HttpGet("files")]
        public IActionResult GetFiles([FromQuery] string category = "general")
        {
            var uploadFolder = Path.Combine(_env.ContentRootPath, "Uploads", category);
            if (!Directory.Exists(uploadFolder))
                return Ok(new { files = Array.Empty<string>() });
            var files = Directory.GetFiles(uploadFolder)
                .Select(f => new
                {
                    fileName    = Path.GetFileName(f),
                    category    = category,
                    size        = new FileInfo(f).Length,
                    uploadedAt  = new FileInfo(f).CreationTimeUtc,
                    downloadUrl = $"/api/fileupload/download/{category}/{Path.GetFileName(f)}"
                });
            return Ok(new { files });
        }
        [HttpGet("download/{category}/{fileName}")]
        public IActionResult Download(string category, string fileName)
        {
            var filePath = Path.Combine(_env.ContentRootPath, "Uploads", category, fileName);
            if (!System.IO.File.Exists(filePath))
                return NotFound(new { message = "File not found." });
            var contentType = GetContentType(Path.GetExtension(fileName));
            var fileBytes   = System.IO.File.ReadAllBytes(filePath);
            return File(fileBytes, contentType, fileName);
        }
        [HttpDelete("delete/{category}/{fileName}")]
        public async Task<IActionResult> Delete(string category, string fileName)
        {
            var filePath = Path.Combine(_env.ContentRootPath, "Uploads", category, fileName);
            if (!System.IO.File.Exists(filePath))
                return NotFound(new { message = "File not found." });
            System.IO.File.Delete(filePath);
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            int? userId     = userIdClaim != null ? int.Parse(userIdClaim) : null;
            await _logService.LogAsync(
                action:      "FileDeleted",
                entityType:  "File",
                entityId:    null,
                description: $"File '{fileName}' deleted from category '{category}'",
                userId:      userId
            );
            return Ok(new { message = "File deleted successfully." });
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