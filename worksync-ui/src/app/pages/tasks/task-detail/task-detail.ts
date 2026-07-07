import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TaskService } from '../../../services/task.service';
import { AuthService } from '../../../services/auth.service';
import { EmployeeService } from '../../../services/employeeservice';
import { ToastService } from '../../../shared/toast/toastservice';
import { TaskItem } from '../../../models/task.model';
import { Employee } from '../../../models/employeemodel';
import { constants } from '../../../constants/string';
 
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
 
  readonly statuses = ['Pending', 'In Progress', 'Completed'];
  readonly priorities = ['Low', 'Medium', 'High'];
 
  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
 
  ngOnInit(): void {
    this.role = this.authService.getRole();
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.notFound = true; return; }
 
    forkJoin({
      task: this.taskService.getById(+id).pipe(catchError(() => of(null))),
      employees: this.employeeService.getAll().pipe(catchError(() => of([] as Employee[])))
    }).subscribe(({ task, employees }) => {
      if (!task) { this.notFound = true; }
      else {
        this.task = task;
        this.selectedStatus = task.status;
        this.selectedPriority = task.priority;
      }
      this.allEmployees = employees;
      this.cdr.detectChanges();
    });
  }
  get isAdminOrManager(): boolean {
    return this.role === 'Admin' || this.role === 'Manager';
  }
  get unassignedEmployees(): Employee[] {
    const assignedIds = this.task?.assignments?.map(a => a.employeeId) ?? [];
    return this.allEmployees.filter(e => !assignedIds.includes(e.id));
  }
  saveChanges(): void {
    if (!this.task) return;
    this.isSaving = true;
    const statusChanged = this.selectedStatus !== this.task.status;
    const priorityChanged = this.selectedPriority !== this.task.priority;
    if (!statusChanged && !priorityChanged) { this.isSaving = false; return; }
    const calls: any[] = [];
    if (statusChanged) calls.push(this.taskService.updateStatus(this.task.id, { status: this.selectedStatus }));
    if (priorityChanged) calls.push(this.taskService.updatePriority(this.task.id, this.selectedPriority));
    forkJoin(calls).subscribe({
      next: () => {
        this.task!.status = this.selectedStatus;
        this.task!.priority = this.selectedPriority;
        this.isSaving = false;
        this.toastService.show('Task updated successfully');
        this.cdr.detectChanges();
      },
      error: () => {
        this.isSaving = false;
        this.toastService.show('Failed to update task', 'error');
        this.cdr.detectChanges();
      }
    });
  }
  toggleAssignMenu(): void {
    this.showAssignMenu = !this.showAssignMenu;
  }
  assignEmployee(empId: number): void {
    if (!this.task) return;
    this.taskService.assign({ taskId: this.task.id, employeeId: empId }).subscribe({
      next: (res) => {
        const emp = this.allEmployees.find(e => e.id === empId);
        if (emp) {
          this.task!.assignments = [...(this.task!.assignments ?? []), {
            id: res.assignmentId, taskId: this.task!.id,
            employeeId: empId, employeeName: emp.name, assignedAt: new Date().toISOString()
          }];
        }
        this.showAssignMenu = false;
        this.toastService.show(emp?.name + ' assigned');
        this.cdr.detectChanges();
      },
      error: () => { this.toastService.show('Failed to assign', 'error'); }
    });
  }
  postComment(): void {
    if (!this.task || !this.newComment.trim()) return;
    this.isCommenting = true;
    const userId = this.authService.getUserId();
    const userName = this.authService.getUser()?.name ?? 'You';
    const content = this.newComment.trim();
    this.taskService.addComment({ taskId: this.task.id, userId, content }).subscribe({
      next: (comment) => {
        this.task!.comments = [...(this.task!.comments ?? []), {
          ...comment,
          userName: comment.userName || userName
        }];
        this.newComment = '';
        this.isCommenting = false;
        this.toastService.show('Comment added');
        this.cdr.detectChanges();
      },
      error: () => {
        this.isCommenting = false;
        this.toastService.show('Failed to add comment', 'error');
        this.cdr.detectChanges();
      }
    });
  }
 
  removeAssignment(assignmentId: number, empName: string): void {
    this.taskService.unassign(assignmentId).subscribe({
      next: () => {
        this.task!.assignments = this.task!.assignments?.filter(a => a.id !== assignmentId) ?? [];
        this.toastService.show(empName + ' removed');
        this.cdr.detectChanges();
      },
      error: () => { this.toastService.show('Failed to remove', 'error'); }
    });
  }
 
  deleteTask(): void {
    if (!this.task) return;
    this.taskService.delete(this.task.id).subscribe({
      next: () => {
        this.toastService.show('Task deleted');
        this.router.navigate(['/tasks']);
      },
      error: () => { this.toastService.show('Failed to delete', 'error'); }
    });
  }
 
  priorityClass(p: string): string { return 'badge-priority-' + p.toLowerCase(); }
  statusClass(s: string): string { return 'badge-status-' + s.toLowerCase().replace(/\s+/g, '-'); }
}