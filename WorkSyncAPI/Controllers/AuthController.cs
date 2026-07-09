using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WorkSyncAPI.Data;
using WorkSyncAPI.DTOs.Auth;
using WorkSyncAPI.Models;
using WorkSyncAPI.Services.Implementations;
namespace WorkSyncAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly TokenService _tokenService;
        public AuthController(ApplicationDbContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { message = "Email and password are required." });
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email && u.IsActive);
            if (user == null)
                return Unauthorized(new { message = "Invalid email or password." });
            var isValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            if (!isValid)
                return Unauthorized(new { message = "Invalid email or password." });
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Email == user.Email);
            var token = _tokenService.GenerateToken(user);
            return Ok(new LoginResponseDto
            {
                Token = token,
                UserId = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                EmployeeId = employee?.Id
            });
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) ||
                string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { message = "All fields are required." });
            var emailExists = await _context.Users.AnyAsync(u => u.Email == dto.Email);
            if (emailExists)
                return Conflict(new { message = "Email already registered." });
            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role ?? "Employee",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "User registered successfully." });
        }
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId   = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var name     = User.FindFirst(ClaimTypes.Name)?.Value;
            var email    = User.FindFirst(ClaimTypes.Email)?.Value;
            var role     = User.FindFirst(ClaimTypes.Role)?.Value;
            var employee = email != null
                ? await _context.Employees.FirstOrDefaultAsync(e => e.Email == email)
                : null;
            return Ok(new
            {
                userId,name,email,role,employeeId = employee?.Id
            });
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
