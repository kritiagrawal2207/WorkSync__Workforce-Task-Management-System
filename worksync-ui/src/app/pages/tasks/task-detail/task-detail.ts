import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { AuthService } from '../../../services/auth.service';
import { TaskItem } from '../../../models/task.model';
import { constants } from '../../../constants/string';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetailComponent implements OnInit {
  readonly c = constants;
  task: TaskItem | null = null;
  isLoading = true;
  notFound = false;
  role = '';

  selectedStatus = '';
  isUpdatingStatus = false;
  statusMsg = '';
  statusError = '';

  commentText = '';
  isAddingComment = false;
  commentError = '';

  showDeleteConfirm = false;
  isDeleting = false;

  readonly statuses = ['Pending', 'In Progress', 'Completed'];

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole();
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.notFound = true; this.isLoading = false; return; }

    this.taskService.getById(+id).subscribe({
      next: (task) => { this.task = task; this.selectedStatus = task.status; this.isLoading = false; },
      error: () => { this.notFound = true; this.isLoading = false; },
    });
  }

  get isAdminOrManager(): boolean {
    return this.role === 'Admin' || this.role === 'Manager';
  }

  editTask(): void { this.router.navigate(['/tasks', this.task!.id, 'edit']); }

  updateStatus(): void {
    if (!this.task || this.selectedStatus === this.task.status) return;
    this.isUpdatingStatus = true;
    this.statusMsg = '';
    this.statusError = '';

    this.taskService.updateStatus(this.task.id, { status: this.selectedStatus }).subscribe({
      next: () => {
        this.task!.status = this.selectedStatus;
        this.statusMsg = this.c.TASK_STATUS_UPDATED_OK;
        this.isUpdatingStatus = false;
      },
      error: () => { this.statusError = this.c.TASK_STATUS_UPDATE_ERROR; this.isUpdatingStatus = false; },
    });
  }

  addComment(): void {
    if (!this.commentText.trim() || !this.task) return;
    this.isAddingComment = true;
    this.commentError = '';

    this.taskService.addComment({
      taskId: this.task.id,
      userId: this.authService.getUserId(),
      content: this.commentText.trim(),
    }).subscribe({
      next: (comment) => {
        this.task!.comments = [...(this.task!.comments ?? []), comment];
        this.commentText = '';
        this.isAddingComment = false;
      },
      error: () => { this.commentError = this.c.TASK_COMMENT_ERROR; this.isAddingComment = false; },
    });
  }

  confirmDelete(): void {
    this.isDeleting = true;
    this.taskService.delete(this.task!.id).subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: () => { this.isDeleting = false; this.showDeleteConfirm = false; },
    });
  }

  priorityClass(p: string): string { return 'badge-priority-' + p.toLowerCase(); }
  statusClass(s: string): string { return 'badge-status-' + s.toLowerCase().replace(/\s+/g, '-'); }
}