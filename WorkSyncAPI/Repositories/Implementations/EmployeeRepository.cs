using Microsoft.EntityFrameworkCore;
using WorkSyncAPI.Data;
using WorkSyncAPI.Models;
using WorkSyncAPI.Repositories.Interfaces;
namespace WorkSyncAPI.Repositories.Implementations
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly ApplicationDbContext _context;
        public EmployeeRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Employee>> GetAllAsync()
        {
            return await _context.Employees
                .Include(e => e.Department)
                .ToListAsync();
        }
        public async Task<Employee?> GetByIdAsync(int id)
        {
            return await _context.Employees
                .Include(e => e.Department)
                .FirstOrDefaultAsync(e => e.Id == id);
        }
        public async Task<Employee?> GetByEmailAsync(string email)
        {
            return await _context.Employees
                .FirstOrDefaultAsync(e => e.Email.ToLower() == email.ToLower());
        }
        public async Task<Employee> CreateAsync(Employee employee)
        {
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return employee;
        }
        public async Task<Employee> UpdateAsync(Employee employee)
        {
            _context.Employees.Update(employee);
            await _context.SaveChangesAsync();
            return employee;
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return false;
            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Employees.AnyAsync(e => e.Id == id);
        }
    }
}