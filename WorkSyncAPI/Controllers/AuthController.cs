using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WorkSyncAPI.Data;
using WorkSyncAPI.DTOs.Auth;
using WorkSyncAPI.Services.Implementations;
using WorkSyncAPI.Services.Interfaces;
namespace WorkSyncAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ApplicationDbContext _context;
        public AuthController(IAuthService authService, ApplicationDbContext context)
        {
            _authService = authService;
            _context = context;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { message = "Email and password are required." });
            var result = await _authService.LoginAsync(dto);
            if (result == null)
                return Unauthorized(new { message = "Invalid email or password." });
            return Ok(result);
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) ||
                string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { message = "All fields are required." });
            var (success, message) = await _authService.RegisterAsync(dto);
            if (!success) return Conflict(new { message });
            return Ok(new { message });
        }
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var name   = User.FindFirst(ClaimTypes.Name)?.Value;
            var email  = User.FindFirst(ClaimTypes.Email)?.Value;
            var role   = User.FindFirst(ClaimTypes.Role)?.Value;
            var employee = email != null
                ? await _context.Employees.FirstOrDefaultAsync(e => e.Email == email)
                : null;
            return Ok(new { userId, name, email, role, employeeId = employee?.Id });
        }
        [HttpGet("validate")]
        [Authorize]
        public IActionResult ValidateToken()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role   = User.FindFirst(ClaimTypes.Role)?.Value;
            return Ok(new { valid = true, userId, role });
        }
    }
}