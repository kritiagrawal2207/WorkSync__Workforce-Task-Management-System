import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TaskService } from '../../../services/task.service';
import { AuthService } from '../../../services/auth.service';
import { EmployeeService } from '../../../services/employeeservice';
import { Employee } from '../../../models/employeemodel';
import { TaskCreateRequest } from '../../../models/task.model';
import { constants } from '../../../constants/string';
@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './task-form.html',
})
export class TaskFormComponent implements OnInit {
  readonly c = constants;
  isEdit = false;
  taskId = 0;
  isLoading = false;
  isSaving = false;
  errorMsg = '';
  title = '';
  description = '';
  priority = 'Medium';
  status = 'Pending';
  dueDate = '';
  selectedEmployeeIds: number[] = [];
  employees: Employee[] = [];
  readonly priorities = ['Low', 'Medium', 'High'];
  readonly statuses = ['Pending', 'In Progress', 'Completed'];
  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone
  ) {}
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!id;
    this.taskId = id ? +id : 0;
    const employees$ = this.employeeService.getAll().pipe(catchError(() => of([] as Employee[])));
    const task$ = this.isEdit
      ? this.taskService.getById(this.taskId).pipe(catchError(() => of(null)))
      : of(null);
    forkJoin({ employees: employees$, task: task$ }).subscribe({
      next: ({ employees, task }) => {
        this.ngZone.run(() => {
          this.employees = employees ?? [];
          if (task) {
            this.title = task.title;
            this.description = task.description;
            this.priority = task.priority;
            this.status = task.status;
            this.dueDate = task.dueDate ? task.dueDate.substring(0, 10) : '';
            this.selectedEmployeeIds = task.assignments?.map((a) => a.employeeId) ?? [];
          }
          this.isLoading = false;
        });
      },
      error: () => {
        this.ngZone.run(() => { this.isLoading = false; });
      }
    });
  }
  toggleEmployee(empId: number): void {
    const idx = this.selectedEmployeeIds.indexOf(empId);
    this.selectedEmployeeIds = idx === -1
      ? [...this.selectedEmployeeIds, empId]
      : this.selectedEmployeeIds.filter((id) => id !== empId);
  }
  isSelected(empId: number): boolean {
    return this.selectedEmployeeIds.includes(empId);
  }
  save(): void {
    this.errorMsg = '';
    if (!this.title.trim()) { this.errorMsg = this.c.TASK_TITLE_REQUIRED; return; }
    this.isSaving = true;
    const payload: TaskCreateRequest = {
      title: this.title.trim(),
      description: this.description.trim(),
      priority: this.priority,
      status: this.status,
      createdByUserId: this.authService.getUserId(),
      dueDate: this.dueDate,
    };
    if (this.isEdit) {
      this.taskService.update(this.taskId, payload).subscribe({
        next: () => this.assignAndNavigate(this.taskId),
        error: () => { this.errorMsg = this.c.TASK_SAVE_ERROR; this.isSaving = false; },
      });
    } else {
      this.taskService.create(payload).subscribe({
        next: (res) => this.assignAndNavigate(res.taskId),
        error: () => { this.errorMsg = this.c.TASK_SAVE_ERROR; this.isSaving = false; },
      });
    }
  }
  private assignAndNavigate(taskId: number): void {
  if (!this.selectedEmployeeIds.length) {
    this.router.navigate(['/tasks', taskId]);
    return;
  }
  const calls = this.selectedEmployeeIds.map((empId) => {
    const emp = this.employees.find(e => e.id === empId);
    return this.taskService.assign({
      taskId,
      employeeId: empId,
      assignedUserId: emp?.userId ?? undefined
    }).pipe(catchError(() => of(null)));
  });
  forkJoin(calls).subscribe(() => this.router.navigate(['/tasks', taskId]));
}
  cancel(): void {
    this.router.navigate([this.isEdit ? '/tasks/' + this.taskId : '/tasks']);
  }
}