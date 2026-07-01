using System.ComponentModel.DataAnnotations;
namespace WorkSyncAPI.DTOs
{
    public class EmployeeCreateDto
    {
        [Required(ErrorMessage = "Name is required")]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;
        [MaxLength(50)]
        public string? Phone { get; set; }
        [Required(ErrorMessage = "Department is required")]
        public int DepartmentId { get; set; }
    }
}