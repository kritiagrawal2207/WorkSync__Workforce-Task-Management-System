namespace WorkSyncAPI.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public int DepartmentId { get; set; }
        public int? UserId { get; set; }
        public Department? Department { get; set; }
    }
}