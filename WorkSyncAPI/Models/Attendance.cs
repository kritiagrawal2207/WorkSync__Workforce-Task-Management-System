namespace WorkSyncAPI.Models;

public class Attendance
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Present"; 
    public Employee? Employee { get; set; }
}