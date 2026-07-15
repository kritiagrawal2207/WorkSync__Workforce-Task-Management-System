import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin, of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TaskService } from '../../../services/task.service';
import { AuthService } from '../../../services/auth.service';
import { EmployeeService } from '../../../services/employeeservice';
import { FileUploadService } from '../../../services/file-upload.service';
import { ToastService } from '../../../shared/toast/toastservice';
import { TaskItem, TaskFile } from '../../../models/task.model';
import { Employee } from '../../../models/employeemodel';
import { constants } from '../../../constants/string';
import { HttpClient } from '@angular/common/http';
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
  taskFiles: TaskFile[] = [];
  isUploadingFile = false;
  previewFile: TaskFile | null = null;
  previewUrl = '';

  readonly statuses   = ['Pending', 'In Progress', 'Completed'];
  readonly priorities = ['Low', 'Medium', 'High'];
  readonly imageExts  = ['.jpg', '.jpeg', '.png', '.gif'];
  readonly pdfExt     = '.pdf';

  constructor(
    private taskService:TaskService,
    private authService: AuthService,
    private employeeService: EmployeeService,
    private fileService: FileUploadService,
    private toastService:ToastService,
    private route:ActivatedRoute,
    private router:Router,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole();
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.notFound = true; return; }
    forkJoin({
      task:this.taskService.getById(+id).pipe(catchError(() => of(null))),
      employees: this.employeeService.getAll().pipe(catchError(() => of([] as Employee[]))),
      files:this.fileService.getTaskFiles(+id).pipe(catchError(() => of([] as TaskFile[])))
    }).subscribe(({ task, employees, files }) => {
      if (!task) { this.notFound = true; }
      else {
        this.task = task;
        this.selectedStatus   = task.status;
        this.selectedPriority = task.priority;
      }
      this.allEmployees = employees;
      this.taskFiles    = files;
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || !this.task) return;
    const file = input.files[0];
    this.isUploadingFile = true;
    this.fileService.uploadForTask(this.task.id, file).subscribe({
      next: (uploaded: TaskFile) => {
        this.taskFiles = [uploaded, ...this.taskFiles];
        this.isUploadingFile = false;
        this.toastService.show(file.name + constants.FILE_UPLOAD_SUCCESS_SUFFIX);
        input.value = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.isUploadingFile = false;
        this.toastService.show(constants.FILE_UPLOAD_FAILED, 'error');
        input.value = '';
        this.cdr.detectChanges();
      }
    });
  }

  deleteFile(file: TaskFile): void {
    if (!this.task) return;
    this.fileService.deleteFile(this.task.id, file.id).subscribe({
      next: () => {
        this.taskFiles = this.taskFiles.filter(f => f.id !== file.id);
        if (this.previewFile?.id === file.id) this.closePreview();
        this.toastService.show(constants.FILE_DELETE_SUCCESS);
        this.cdr.detectChanges();
      },
      error: () => this.toastService.show(constants.FILE_DELETE_FAILED, 'error')
    });
  }

  openPreview(file: TaskFile): void {
    this.previewFile = file;
    this.previewUrl  = '';
    const token = this.authService.getToken();
    this.http.get(constants.API_BASE_URL + file.previewUrl, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        this.previewUrl = URL.createObjectURL(blob);
        this.cdr.detectChanges();
      },
      error: () => this.toastService.show(constants.FAILED_TO_LOAD, 'error')
    });
  }

  closePreview(): void {
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewFile = null;
    this.previewUrl  = '';
  }

  isImage(file: TaskFile): boolean {
    const ext = '.' + file.originalName.split('.').pop()?.toLowerCase();
    return this.imageExts.includes(ext);
  }

  isPdf(file: TaskFile): boolean {
    return file.originalName.toLowerCase().endsWith('.pdf');
  }

  isPreviewable(file: TaskFile): boolean {
    return this.isImage(file) || this.isPdf(file);
  }

  getFileIcon(file: TaskFile): string {
    const ext = file.originalName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext!)) return constants.FILE_ICON_IMAGE;
    if (ext === 'pdf') return constants.FILE_ICON_PDF;
    if (['doc', 'docx'].includes(ext!)) return constants.FILE_ICON_WORD;
    if (['xls', 'xlsx'].includes(ext!)) return constants.FILE_ICON_EXCEL;
    if (['txt', 'csv'].includes(ext!))  return constants.FILE_ICON_TEXT;
    return constants.FILE_ICON_DEFAULT;
  }

  formatSize(bytes: number): string {
    if (bytes < 1024)        return bytes + constants.FILE_SIZE_B;
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + constants.FILE_SIZE_KB;
    return (bytes / (1024 * 1024)).toFixed(1) + constants.FILE_SIZE_MB;
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