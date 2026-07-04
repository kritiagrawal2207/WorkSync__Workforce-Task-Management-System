using WorkSyncAPI.DTOs.Auth;
namespace WorkSyncAPI.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto?> LoginAsync(LoginRequestDto dto);
        Task<(bool Success, string Message)> RegisterAsync(RegisterRequestDto dto);
    }
}