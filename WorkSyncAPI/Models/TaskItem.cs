namespace WorkSyncAPI.Models;

public class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string Priority { get; set; } = "";
    public string Status { get; set; } = "";
    public int CreatedByUserId { get; set; }
    public User? CreatedBy { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<TaskAssignment>? Assignments { get; set; }
    public ICollection<TaskComment>? Comments { get; set; }
}