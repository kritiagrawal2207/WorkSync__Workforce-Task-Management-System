namespace WorkSyncAPI.DTOs.Task
{
    public class TaskCreateDto
    {
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public string Priority { get; set; } = "Medium";
        public string Status { get; set; } = "Pending";
        public int CreatedByUserId { get; set; }
        public DateTime DueDate { get; set; }
    }
}