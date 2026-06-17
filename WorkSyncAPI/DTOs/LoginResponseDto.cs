namespace WorkSyncAPI.DTOs;

public class LoginResponseDto
{
    public string Token { get; set; } = "";
    public string Role { get; set; } = "";
    public string Name { get; set; } = "";
}