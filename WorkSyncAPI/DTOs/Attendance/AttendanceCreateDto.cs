namespace WorkSyncAPI.DTOs.Attendance;

public class AttendanceCreateDto
{
    public int EmployeeId { get; set; }
    public DateTime CheckIn { get; set; }
    public DateTime? CheckOut { get; set; }
    public string Status { get; set; } = "";
}