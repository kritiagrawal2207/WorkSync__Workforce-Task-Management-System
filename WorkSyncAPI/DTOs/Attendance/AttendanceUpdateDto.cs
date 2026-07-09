namespace WorkSyncAPI.DTOs.Attendance
{
    public class AttendanceUpdateDto
    {
        public DateTime CheckOut { get; set; }
        public string Status { get; set; } = string.Empty;
        public int? UserId { get; set; }
    }
}