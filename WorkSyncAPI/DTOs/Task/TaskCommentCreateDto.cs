namespace WorkSyncAPI.DTOs.Task
{
    public class TaskCommentCreateDto
    {
        public int TaskId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; } = "";
    }
}