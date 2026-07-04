using WorkSyncAPI.DTOs;
 
namespace WorkSyncAPI.Services.Interfaces;
 
public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);
    Task<(bool Success, string Message, object? Data)> RegisterAsync(RegisterUserDto dto);
}