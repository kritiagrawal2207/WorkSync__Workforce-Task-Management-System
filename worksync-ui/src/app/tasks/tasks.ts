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

  tasks = signal<TaskItem[]>([]);
  employees = signal<Employee[]>([]);
  isLoading = signal<boolean>(false);
  editingTask = signal<TaskItem | null>(null);

  // Create form fields
  newTitle = '';
  newDescription = '';
  newPriority = 'Medium';
  newDueDate = '';

  // Edit form fields
  editTitle = '';
  editDescription = '';
  editPriority = '';
  editDueDate = '';

  // Assign fields
  assignTaskId: number | null = null;
  assignEmployeeId: number | null = null;

  // Status update fields
  statusTaskId: number | null = null;
  newStatus = '';

  // Comment fields
  commentTaskId: number | null = null;
  commentContent = '';

  // Filter fields
  filterStatus = '';
  filterPriority = '';

  banner = signal<string>('');
  bannerType = signal<BannerType>('');

  filteredTasks = computed(() => {
    let list = this.tasks();
    if (this.filterStatus) list = list.filter(t => t.status === this.filterStatus);
    if (this.filterPriority) list = list.filter(t => t.priority === this.filterPriority);
    return list;
  });

  ngOnInit(): void {
    this.loadTasks();
    this.loadEmployees();
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
      error: () => this.showBanner(this.text.deleteError, 'error')
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
    if (!this.commentTaskId || !this.commentContent) return;
    this.taskService.addComment({
      taskId: this.commentTaskId,
      userId: this.authService.getUserId(),
      content: this.commentContent
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