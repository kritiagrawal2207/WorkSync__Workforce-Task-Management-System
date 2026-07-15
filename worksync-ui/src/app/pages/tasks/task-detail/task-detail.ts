import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin, of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TaskService } from '../../../services/task.service';
import { AuthService } from '../../../services/auth.service';
import { EmployeeService } from '../../../services/employeeservice';
import { ToastService } from '../../../shared/toast/toastservice';
import { TaskItem } from '../../../models/task.model';
import { Employee } from '../../../models/employeemodel';
import { constants } from '../../../constants/string';
import { UserRole } from '../../../enums/user-role.enum';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './task-detail.html',
})
export class TaskDetailComponent implements OnInit {
  readonly constants = constants;
  task: TaskItem | null = null;
  notFound = false;
  role = '';
  selectedStatus = '';
  selectedPriority = '';
  allEmployees: Employee[] = [];
  isSaving = false;
  showAssignMenu = false;
  newComment = '';
  isCommenting = false;

  readonly statuses   = ['Pending', 'In Progress', 'Completed'];
  readonly priorities = ['Low', 'Medium', 'High'];

  constructor(
    private taskService:     TaskService,
    private authService:     AuthService,
    private employeeService: EmployeeService,
    private toastService:    ToastService,
    private route:           ActivatedRoute,
    private router:          Router,
    private cdr:             ChangeDetectorRef,
  ) {}
  ngOnInit(): void {
    this.role = this.authService.getRole();
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.notFound = true; return; }
    forkJoin({
      task:      this.taskService.getById(+id).pipe(catchError(() => of(null))),
      employees: this.employeeService.getAll().pipe(catchError(() => of([] as Employee[]))),
    }).subscribe(({ task, employees }) => {
      if (!task) { this.notFound = true; }
      else {
        this.task = task;
        this.selectedStatus   = task.status;
        this.selectedPriority = task.priority;
      }
      this.allEmployees = employees;
      this.cdr.detectChanges();
    });
  }

  get isAdminOrManager(): boolean {
    return this.role === UserRole.Admin || this.role === UserRole.Manager;
  }

  get unassignedEmployees(): Employee[] {
    const assignedIds = this.task?.assignments?.map(a => a.employeeId) ?? [];
    return this.allEmployees.filter(e => !assignedIds.includes(e.id));
  }

  saveChanges(): void {
    if (!this.task) return;
    this.isSaving = true;
    const statusChanged   = this.selectedStatus   !== this.task.status;
    const priorityChanged = this.selectedPriority !== this.task.priority;
    if (!statusChanged && !priorityChanged) {
      this.isSaving = false;
      this.toastService.show(constants.TASK_NO_CHANGES);
      return;
    }
    const calls: Observable<unknown>[] = [];
    if (statusChanged)   calls.push(this.taskService.updateStatus(this.task.id, { status: this.selectedStatus }));
    if (priorityChanged) calls.push(this.taskService.updatePriority(this.task.id, this.selectedPriority));
    forkJoin(calls).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastService.show(constants.TASK_UPDATED_OK, 'success');
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.isSaving = false;
        this.toastService.show(constants.TASK_UPDATE_FAILED, 'error');
        this.cdr.detectChanges();
      }
    });
  }

  toggleAssignMenu(): void { this.showAssignMenu = !this.showAssignMenu; }

  assignEmployee(empId: number): void {
    if (!this.task) return;
    const emp = this.allEmployees.find(e => e.id === empId);
    this.taskService.assign({ taskId: this.task.id, employeeId: empId, assignedUserId: emp?.userId }).subscribe({
      next: (res) => {
        if (emp) {
          this.task!.assignments = [...(this.task!.assignments ?? []), {
            id: res.assignmentId, taskId: this.task!.id,
            employeeId: empId, employeeName: emp.name, assignedAt: new Date().toISOString()
          }];
        }
        this.showAssignMenu = false;
        this.toastService.show(emp?.name + constants.TASK_ASSIGN_SUCCESS_SUFFIX);
        this.cdr.detectChanges();
      },
      error: () => this.toastService.show(constants.TASK_ASSIGN_FAILED, 'error')
    });
  }
  removeAssignment(assignmentId: number, empName: string): void {
    this.taskService.unassign(assignmentId).subscribe({
      next: () => {
        this.task!.assignments = this.task!.assignments?.filter(a => a.id !== assignmentId) ?? [];
        this.toastService.show(empName + constants.TASK_UNASSIGN_SUFFIX);
        this.cdr.detectChanges();
      },
      error: () => this.toastService.show(constants.TASK_UNASSIGN_FAILED, 'error')
    });
  }

  postComment(): void {
    if (!this.task || !this.newComment.trim()) return;
    this.isCommenting = true;
    const userId   = this.authService.getUserId();
    const userName = this.authService.getUser()?.name ?? 'You';
    const content  = this.newComment.trim();
    this.taskService.addComment({ taskId: this.task.id, userId, content }).subscribe({
      next: (comment) => {
        this.task!.comments = [...(this.task!.comments ?? []), { ...comment, userName: comment.userName || userName }];
        this.newComment = '';
        this.isCommenting = false;
        this.toastService.show(constants.TASK_COMMENT_ADDED);
        this.cdr.detectChanges();
      },
      error: () => {
        this.isCommenting = false;
        this.toastService.show(constants.TASK_COMMENT_FAILED, 'error');
        this.cdr.detectChanges();
      }
    });
  }

  deleteTask(): void {
    if (!this.task) return;
    this.taskService.delete(this.task.id).subscribe({
      next: () => { this.toastService.show(constants.TASK_DELETED_OK); this.router.navigate(['/tasks']); },
      error: () => this.toastService.show(constants.TASK_DELETE_FAILED_DETAIL, 'error')
    });
  }
  priorityClass(p: string): string { return 'badge-priority-' + p.toLowerCase(); }
  statusClass(s: string):   string { return 'badge-status-' + s.toLowerCase().replace(/\s+/g, '-'); }
}