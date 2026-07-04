namespace WorkSyncAPI.DTOs.Task
{
    public class TaskAssignmentResponseDto
    {
        public int Id { get; set; }
        public int TaskId { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = "";
        public DateTime AssignedAt { get; set; }
    }
}