import { Component } from '@angular/core';
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
  styleUrl: './login.css',
})
export class LoginComponent {
  readonly constants = constants; 
  email        = '';
  password     = '';
  errorMessage = '';
<<<<<<< HEAD:worksync-ui/src/app/auth/login/login.ts
  isLoading = false;

  // new
  showForgotModal = false;
  forgotEmail = '';
  showToast = false;

  constructor(private authService: AuthService, private router: Router) {}

  // unchanged
  login() {
=======
  isLoading    = false;
  showForgotModal = false;
  forgotEmail  = '';
  showToast    = false;
  constructor(private authService: AuthService, private router: Router) {}
  login(): void {
>>>>>>> week2:worksync-ui/src/app/pages/login/login.ts
    if (!this.email || !this.password) {
      this.errorMessage = constants.LOGIN_ERROR_FILL_FIELDS;
      return;
    }
<<<<<<< HEAD:worksync-ui/src/app/auth/login/login.ts
    this.isLoading = true;
=======
    this.isLoading    = true;
>>>>>>> week2:worksync-ui/src/app/pages/login/login.ts
    this.errorMessage = '';
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.authService.saveSession(res);
        this.router.navigate(['/dashboard']);
        this.isLoading = false;
      },
<<<<<<< HEAD:worksync-ui/src/app/auth/login/login.ts
     error: (err) => {
  console.log('ERROR BLOCK HIT', err);
  this.errorMessage = typeof err.error === 'string' ? err.error : err.error?.message || 'Invalid email or password.';
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
=======
      error: (err) => {
        this.errorMessage =
          typeof err.error === 'string'
            ? err.error
            : err.error?.message || constants.LOGIN_ERROR_INVALID;
        this.isLoading = false;
      },
    });
  }
  submitForgot(): void {
    this.showForgotModal = false;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 4000);
  }
}
>>>>>>> week2:worksync-ui/src/app/pages/login/login.ts
