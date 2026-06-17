namespace WorkSyncAPI.DTOs;

public class TaskCreateDto
{
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string Priority { get; set; } = "";
    public string Status { get; set; } = "Pending";
    public int CreatedByUserId { get; set; }
    public DateTime DueDate { get; set; }
}

public class TaskAssignDto
{
    public int TaskId { get; set; }
    public int EmployeeId { get; set; }
}

public class TaskCommentCreateDto
{
    public int TaskId { get; set; }
    public int UserId { get; set; }
    public string Content { get; set; } = "";
}