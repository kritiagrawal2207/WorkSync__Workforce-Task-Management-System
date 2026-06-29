import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Constants } from '../string';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  strings = Constants.login;

  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;
  showForgotModal = false;
  forgotEmail = '';
  showToast = false;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.authService.saveSession(res);
        this.router.navigate(['/dashboard']);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage =
          typeof err.error === 'string'
            ? err.error
            : err.error?.message || 'Invalid email or password.';
        this.isLoading = false;
      }
    });
  }

  submitForgot() {
    this.showForgotModal = false;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 4000);
  }
}