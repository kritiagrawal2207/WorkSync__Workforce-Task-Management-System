using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkSyncAPI.Data;
using WorkSyncAPI.DTOs;
using WorkSyncAPI.Models;
using WorkSyncAPI.Services;

namespace WorkSyncAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly JwtService _jwtService;
    private readonly PasswordHashService _passwordHashService;
    private readonly ApplicationDbContext _context;

    public AuthController(JwtService jwtService, PasswordHashService passwordHashService, ApplicationDbContext context)
    {
        _jwtService = jwtService;
        _passwordHashService = passwordHashService;
        _context = context;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequestDto request)
    {
        var response = await _jwtService.Authenticate(request);
        if (response == null) return Unauthorized("Invalid Email or Password");
        return Ok(response);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterUserDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            return BadRequest("Email already exists");

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = _passwordHashService.HashPassword(dto.Password)
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == dto.Role)
        ?? await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == "Employee");

if (role == null)
{
    role = new Role { RoleName = dto.Role == "Admin" ? "Admin" : "Employee" };
    _context.Roles.Add(role);
    await _context.SaveChangesAsync();
}

        _context.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = role.Id });
        await _context.SaveChangesAsync();

        return Ok(new { user.Id, user.Name, user.Email, Role = role.RoleName });
    }

    [Authorize]
    [HttpGet("validate")]
    public IActionResult Validate() => Ok(new { Message = "Token Valid" });
}