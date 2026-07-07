export interface EmployeeWorkload {
  employeeId: number;
  employeeName: string;
  taskCount: number;
}
export interface DashboardSummary {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  attendancePercentage: number;
  employeeWorkloads: EmployeeWorkload[];
}
export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}