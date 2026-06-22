import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  // new
  showForgotModal = false;
  forgotEmail = '';
  showToast = false;

  constructor(private authService: AuthService, private router: Router) {}

  // unchanged
  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill all fields';
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
  console.log('ERROR BLOCK HIT', err);
  this.errorMessage = err.error || 'Login failed. Try again.';
  this.isLoading = false;
}
    });
  }

  // new
  submitForgot() {
    this.showForgotModal = false;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 4000);
  }
}
