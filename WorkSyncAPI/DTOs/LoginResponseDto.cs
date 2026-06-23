namespace WorkSyncAPI.DTOs;

public class LoginResponseDto
{
    public string Token { get; set; } = "";
    public string Role { get; set; } = "";
    public string Name { get; set; } = "";
    public int userId { get; set;}
    public int employeeId { get; set; }
}