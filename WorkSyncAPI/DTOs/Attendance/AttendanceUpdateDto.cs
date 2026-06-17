namespace WorkSyncAPI.DTOs.Attendance;

public class AttendanceUpdateDto
{
    public DateTime? CheckOut { get; set; }
    public string Status { get; set; } = "";
}