import { Component, ChangeDetectorRef } from '@angular/core';  
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { constants } from '../../constants/string';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  protected readonly constants = constants;
  email        = '';
  password     = '';
  errorMessage = '';
  isLoading    = false;
  showToast    = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef   
  ) {}

  login(): void {
    if (!this.email || !this.password) {
      this.errorMessage = constants.LOGIN_ERROR_FILL_FIELDS;
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.cdr.detectChanges();     
        this.authService.saveSession(res);
        const dest = (res.role === 'Employee') ? '/tasks' : '/dashboard';
        this.router.navigate([dest]);
      },
      error: (err) => {
        this.isLoading = false;
        this.email = '';
        this.password = '';
        if (err.status === 0) {
          this.errorMessage = 'Cannot reach server. Please check if the backend is running.';
        } else {
          this.errorMessage =
            typeof err.error === 'string'
              ? err.error
              : err.error?.message || constants.LOGIN_ERROR_INVALID;
        }
        this.cdr.detectChanges();  
      },
    });
  }

  showForgotToast(): void {
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 4000);
  }
}