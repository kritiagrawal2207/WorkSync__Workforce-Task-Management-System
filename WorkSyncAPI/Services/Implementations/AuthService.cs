using Microsoft.EntityFrameworkCore;
using WorkSyncAPI.Data;
using WorkSyncAPI.DTOs.Auth;
using WorkSyncAPI.Models;
using WorkSyncAPI.Services.Interfaces;
namespace WorkSyncAPI.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly TokenService _tokenService;
        public AuthService(ApplicationDbContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }
        public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email && u.IsActive);
            if (user == null) return null;
            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash)) return null;
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Email == user.Email);
            return new LoginResponseDto
            {
                Token      = _tokenService.GenerateToken(user),
                UserId     = user.Id,
                Name       = user.Name,
                Email      = user.Email,
                Role       = user.Role,
                EmployeeId = employee?.Id
            };
        }
        public async Task<(bool Success, string Message)> RegisterAsync(RegisterRequestDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return (false, "Email already registered.");
            _context.Users.Add(new User
            {
                Name         = dto.Name,
                Email        = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role         = dto.Role ?? "Employee",
                IsActive     = true,
                CreatedAt    = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
            return (true, "User registered successfully.");
        }
    }
}