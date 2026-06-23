using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkSyncAPI.DTOs;
using WorkSyncAPI.Services.Interfaces;
namespace WorkSyncAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequestDto request)
    {
        var response = await _authService.LoginAsync(request);
        if (response == null) return Unauthorized("Invalid Email or Password");
        return Ok(response);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterUserDto dto)
    {
        var (success, message, data) = await _authService.RegisterAsync(dto);
        if (!success) return BadRequest(message);
        return Ok(data);
    }

    [Authorize]
    [HttpGet("validate")]
    public IActionResult Validate() => Ok(new { Message = "Token Valid" });
}