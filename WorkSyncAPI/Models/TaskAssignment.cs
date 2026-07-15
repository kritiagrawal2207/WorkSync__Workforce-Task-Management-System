namespace WorkSyncAPI.Models;

public class TaskAssignment
{
    public int Id { get; set; }
    public int TaskId { get; set; }
    public TaskItem? Task { get; set; }
    public int EmployeeId { get; set; }
    public Employee? Employee { get; set; }
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
}