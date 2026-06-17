using Microsoft.EntityFrameworkCore;
using WorkSyncAPI.Data;
using WorkSyncAPI.Models;
using WorkSyncAPI.Repositories.Interfaces;

namespace WorkSyncAPI.Repositories.Implementations;

public class EmployeeRepository : IEmployeeRepository
{
    private readonly ApplicationDbContext _context;
    public EmployeeRepository(ApplicationDbContext context) => _context = context;

    public Task<List<Employee>> GetAllAsync() =>
        _context.Employees.Include(e => e.Department).ToListAsync();

    public Task<Employee?> GetByIdAsync(int id) =>
        _context.Employees.Include(e => e.Department).FirstOrDefaultAsync(e => e.Id == id);

    public Task<bool> EmailExistsAsync(string email) =>
        _context.Employees.AnyAsync(e => e.Email == email);

    public async Task AddAsync(Employee employee) =>
        await _context.Employees.AddAsync(employee);

    public Task UpdateAsync(Employee employee)
    {
        _context.Employees.Update(employee);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Employee employee)
    {
        _context.Employees.Remove(employee);
        return Task.CompletedTask;
    }

    public Task SaveAsync() => _context.SaveChangesAsync();
}