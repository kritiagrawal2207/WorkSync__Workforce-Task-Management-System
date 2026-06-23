import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../shared/services/task.service';
import { EmployeeService } from '../shared/services/employee.service';
import { AuthService } from '../auth/auth.service';
import { Employee } from '../shared/models/employee.model';
import { TaskItem, TaskCreateRequest } from '../shared/models/task.model';
import { TASKS_TEXT, COMMON_TEXT } from '../shared/constants/ui-strings';
import { LoaderComponent } from '../shared/components/loader/loader';
import { ButtonComponent } from '../shared/components/button/button';

type BannerType = 'success' | 'error' | '';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent, ButtonComponent],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class TasksComponent implements OnInit {
  private taskService = inject(TaskService);
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);

  readonly text = TASKS_TEXT;
  readonly commonText = COMMON_TEXT;

  role = this.authService.getRole();
  currentUserId = this.authService.getUserId();
  currentEmployeeId = this.authService.getEmployeeId();

  get isAdmin(): boolean        { return this.role === 'Admin'; }
  get isManager(): boolean      { return this.role === 'Manager'; }
  get isEmployee(): boolean     { return this.role === 'Employee'; }
  get canManageTasks(): boolean { return this.isAdmin || this.isManager; }

  tasks = signal<TaskItem[]>([]);
  employees = signal<Employee[]>([]);
  isLoading = signal<boolean>(false);
  editingTask = signal<TaskItem | null>(null);

  newTitle = '';
  newDescription = '';
  newPriority = 'Medium';
  newDueDate = '';

  editTitle = '';
  editDescription = '';
  editPriority = '';
  editDueDate = '';
  assignTaskId: number | null = null;
  assignEmployeeId: number | null = null;
  statusTaskId: number | null = null;
  newStatus = '';
  commentTaskId: number | null = null;
  commentContent = '';
  filterStatus = '';
  filterPriority = '';
  banner = signal<string>('');
  bannerType = signal<BannerType>('');
  filteredTasks = computed(() => {
    let list = this.tasks();
    if (this.isEmployee) {
      list = list.filter(t =>
        t.assignments?.some(a => a.employeeId === this.currentEmployeeId)
      );
    }
    if (this.filterStatus)   list = list.filter(t => t.status === this.filterStatus);
    if (this.filterPriority) list = list.filter(t => t.priority === this.filterPriority);
    return list;
  });
  dropdownTasks = computed(() => {
    if (this.isEmployee) {
      return this.tasks().filter(t =>
        t.assignments?.some(a => a.employeeId === this.currentEmployeeId)
      );
    }
    return this.tasks();
  });
  get tableColspan(): number {
    return this.canManageTasks ? 6 : 5;
  }

  ngOnInit(): void {
    this.loadTasks();
    if (this.canManageTasks) {
      this.loadEmployees();
    }
  }

  loadTasks(): void {
    this.isLoading.set(true);
    this.taskService.getAll().subscribe({
      next: (tasks) => { this.tasks.set(tasks); this.isLoading.set(false); },
      error: () => { this.showBanner(this.text.loadError, 'error'); this.isLoading.set(false); }
    });
  }

  loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (employees) => this.employees.set(employees),
      error: () => {}
    });
  }

  createTask(): void {
    if (!this.newTitle || !this.newDueDate) {
      this.showBanner(this.text.validationMsg, 'error');
      return;
    }
    const request: TaskCreateRequest = {
      title: this.newTitle,
      description: this.newDescription,
      priority: this.newPriority,
      status: 'Pending',
      createdByUserId: this.authService.getUserId(),
      dueDate: new Date(this.newDueDate).toISOString()
    };
    this.taskService.create(request).subscribe({
      next: () => {
        this.showBanner(this.text.createSuccess, 'success');
        this.newTitle = '';
        this.newDescription = '';
        this.newPriority = 'Medium';
        this.newDueDate = '';
        this.loadTasks();
      },
      error: () => this.showBanner(this.text.createError, 'error')
    });
  }

  startEdit(task: TaskItem): void {
    this.editingTask.set(task);
    this.editTitle = task.title;
    this.editDescription = task.description;
    this.editPriority = task.priority as string;
    this.editDueDate = task.dueDate.substring(0, 10);
  }

  cancelEdit(): void {
    this.editingTask.set(null);
  }

  updateTask(): void {
    const task = this.editingTask();
    if (!task) return;
    const request: TaskCreateRequest = {
      title: this.editTitle,
      description: this.editDescription,
      priority: this.editPriority,
      status: task.status as string,
      createdByUserId: task.createdByUserId,
      dueDate: new Date(this.editDueDate).toISOString()
    };
    this.taskService.update(task.id, request).subscribe({
      next: () => {
        this.showBanner(this.text.updateSuccess, 'success');
        this.editingTask.set(null);
        this.loadTasks();
      },
      error: () => this.showBanner(this.text.updateError, 'error')
    });
  }

  deleteTask(task: TaskItem): void {
    if (!confirm(this.text.deleteConfirmMsg)) return;
    this.taskService.delete(task.id).subscribe({
      next: () => { this.showBanner(this.text.deleteSuccess, 'success'); this.loadTasks(); },
      error: (err) => {
        const msg = err?.error?.message
          || `Delete failed (${err.status ?? 'unknown error'})`;
        this.showBanner(typeof msg === 'string' ? msg : this.text.deleteError, 'error');
        console.error('Delete task error:', err);
      }
    });
  }

  assignTask(): void {
    if (!this.assignTaskId || !this.assignEmployeeId) return;
    this.taskService.assign({ taskId: this.assignTaskId, employeeId: this.assignEmployeeId }).subscribe({
      next: () => {
        this.showBanner(this.text.assignSuccess, 'success');
        this.assignTaskId = null;
        this.assignEmployeeId = null;
        this.loadTasks();
      },
      error: () => this.showBanner(this.text.assignError, 'error')
    });
  }

  updateStatus(): void {
    if (!this.statusTaskId || !this.newStatus) return;
    this.taskService.updateStatus(this.statusTaskId, { status: this.newStatus }).subscribe({
      next: () => { this.showBanner(this.text.statusUpdateSuccess, 'success'); this.loadTasks(); },
      error: () => this.showBanner(this.text.statusUpdateError, 'error')
    });
  }

  addComment(): void {
    if (!this.commentTaskId || !this.commentContent.trim()) {
      this.showBanner('Please select a task and write a comment.', 'error');
      return;
    }
    if (!this.currentUserId || this.currentUserId === 0) {
      this.showBanner('Session expired. Please login again.', 'error');
      return;
    }
    this.taskService.addComment({
      taskId: this.commentTaskId,
      userId: this.currentUserId,
      content: this.commentContent.trim()
    }).subscribe({
      next: () => {
        this.showBanner(this.text.commentSuccess, 'success');
        this.commentContent = '';
        this.loadTasks();
      },
      error: () => this.showBanner(this.text.commentError, 'error')
    });
  }

  private showBanner(message: string, type: BannerType): void {
    this.banner.set(message);
    this.bannerType.set(type);
    setTimeout(() => this.banner.set(''), 4000);
  }
}