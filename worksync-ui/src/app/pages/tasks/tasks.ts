import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { TaskItem } from '../../models/task.model';
import { constants } from '../../constants/string';
@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class TasksComponent implements OnInit {
  readonly c = constants;
  tasks: TaskItem[] = [];
  isLoading = false;
  errorMsg = '';
  role = '';

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.loadTasks();
  }

  get isAdminOrManager(): boolean {
    return this.role === 'Admin' || this.role === 'Manager';
  }

  loadTasks(): void {
    this.errorMsg = '';
    const obs = this.isAdminOrManager
      ? this.taskService.getAll()
      : this.taskService.getByEmployee(this.authService.getEmployeeId());

    obs.subscribe({
      next: (tasks) => {
        this.tasks = tasks ?? [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMsg = this.c.TASKS_LOAD_ERROR;
        this.cdr.detectChanges();
      },
    });
  }

  openTask(id: number): void {
    this.router.navigate(['/tasks', id]);
  }

  priorityClass(p: string): string {
    return 'badge-priority-' + p.toLowerCase();
  }

  statusClass(s: string): string {
    return 'badge-status-' + s.toLowerCase().replace(/\s+/g, '-');
  }

  assigneeLabel(task: TaskItem): string {
    if (!task.assignments?.length) return '—';
    if (task.assignments.length === 1) return task.assignments[0].employeeName;
    return task.assignments[0].employeeName + ' +' + (task.assignments.length - 1);
  }
}