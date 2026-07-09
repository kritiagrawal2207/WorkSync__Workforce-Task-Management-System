export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export interface TaskAssignment {
  id: number;
  taskId: number;
  employeeId: number;
  employeeName: string;
  assignedAt: string;
}
export interface TaskComment {
  id: number;
  taskId: number;
  userId: number;
  userName: string;
  content: string;
  createdAt: string;
}
export interface TaskItem {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority | string;
  status: TaskStatus | string;
  createdByUserId: number;
  createdByName: string;
  dueDate: string;
  createdAt: string;
  assignments: TaskAssignment[];
  comments: TaskComment[];
}
export interface TaskCreateRequest {
  title: string;
  description: string;
  priority: string;
  status: string;
  createdByUserId: number;
  dueDate: string;
}
export interface TaskAssignRequest {
  taskId: number;
  employeeId: number;
  assignedUserId?: number;
}
export interface TaskStatusUpdateRequest {
  status: string;
}
export interface TaskCommentCreateRequest {
  taskId: number;
  userId: number;
  content: string;
}