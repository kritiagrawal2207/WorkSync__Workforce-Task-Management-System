import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Toast, ToastService } from './toastservice';
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private sub!: Subscription;
  constructor(private toastservice: ToastService) {}
  ngOnInit(): void {
    this.sub = this.toastservice.toast$.subscribe((toast) => {
      this.toasts.push(toast);
      setTimeout(() => this.remove(toast.id), 3000);
    });
}
  remove(id: number): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}