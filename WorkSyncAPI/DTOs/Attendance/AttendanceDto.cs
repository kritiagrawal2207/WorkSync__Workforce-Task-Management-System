namespace WorkSyncAPI.DTOs.Attendance;

public class AttendanceDto
{
    public int EmployeeId { get; set; }
    public string Status { get; set; } = "Present";
}