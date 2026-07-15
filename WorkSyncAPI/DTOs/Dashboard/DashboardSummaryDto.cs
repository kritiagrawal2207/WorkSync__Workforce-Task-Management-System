namespace WorkSyncAPI.DTOs.Dashboard;
public class DashboardSummaryDto
{
    public int TotalTasks { get; set; }
    public int CompletedTasks { get; set; }
    public int PendingTasks { get; set; }
    public double AttendancePercentage { get; set; }   // 0–100
    public List<EmployeeWorkloadDto> EmployeeWorkloads { get; set; } = new();
}
public class EmployeeWorkloadDto
{
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public int TaskCount { get; set; }
}