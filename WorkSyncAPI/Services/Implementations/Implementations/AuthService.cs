using Microsoft.EntityFrameworkCore;
using WorkSyncAPI.Data;
using WorkSyncAPI.DTOs;
using WorkSyncAPI.Models;
using WorkSyncAPI.Services.Interfaces;
 
namespace WorkSyncAPI.Services.Implementations;
 
public class AuthService : IAuthService
{
    private readonly JwtService _jwtService;
    private readonly PasswordHashService _passwordHashService;
    private readonly ApplicationDbContext _context;
 
    public AuthService(JwtService jwtService, PasswordHashService passwordHashService, ApplicationDbContext context)
    {
        _jwtService = jwtService;
        _passwordHashService = passwordHashService;
        _context = context;
    }
 
    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
    {
        return await _jwtService.Authenticate(request);
    }
 
    public async Task<(bool Success, string Message, object? Data)> RegisterAsync(RegisterUserDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            return (false, "Email already exists", null);
 
        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = _passwordHashService.HashPassword(dto.Password)
        };
 
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        // Find role by name, or create it if it doesn't exist
var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == dto.Role);

if (role == null)
{
    role = new Role { RoleName = dto.Role };
    _context.Roles.Add(role);
    await _context.SaveChangesAsync();
}
        if (role == null)
        {
            role = new Role { RoleName = dto.Role == "Admin" ? "Admin" : "Employee" };
            _context.Roles.Add(role);
            await _context.SaveChangesAsync();
        }
 
        _context.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = role.Id });
        await _context.SaveChangesAsync();
 
        return (true, "User registered successfully", new { user.Id, user.Name, user.Email, Role = role.RoleName });
    }
}