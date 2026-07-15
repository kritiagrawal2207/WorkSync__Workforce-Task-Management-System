namespace WorkSyncAPI.DTOs.Task
{
    public class TaskResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public string Priority { get; set; } = "";
        public string Status { get; set; } = "";
        public int CreatedByUserId { get; set; }
        public string CreatedByName { get; set; } = "";
        public DateTime DueDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<TaskAssignmentResponseDto> Assignments { get; set; } = new();
        public List<TaskCommentResponseDto> Comments { get; set; } = new();
    }
}