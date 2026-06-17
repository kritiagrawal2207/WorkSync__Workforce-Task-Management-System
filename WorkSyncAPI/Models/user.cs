namespace WorkSyncAPI.Models;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public ICollection<UserRole>? UserRoles { get; set; }
    public ICollection<TaskItem>? CreatedTasks { get; set; }
    public ICollection<TaskComment>? Comments { get; set; }
}