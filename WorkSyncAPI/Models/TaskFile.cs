namespace WorkSyncAPI.Models
{
    public class TaskFile
    {
        public int Id { get; set; }
        public int TaskId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string OriginalName { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public int? UploadedBy { get; set; }
        public TaskItem? Task { get; set; }
        public User? UploadedByUser { get; set; }
    }
}