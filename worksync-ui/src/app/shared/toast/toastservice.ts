import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}
@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new Subject<Toast>();
  toast$ = this.toastSubject.asObservable();
  private nextId = 0;
  show(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastSubject.next({ id: this.nextId++, message, type });
  }
}