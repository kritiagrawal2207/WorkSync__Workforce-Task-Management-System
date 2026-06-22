namespace WorkSyncAPI.DTOs;

public class EmployeeCreateDto
{
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string? Phone { get; set; }
    public string Department { get; set; } = "";
}