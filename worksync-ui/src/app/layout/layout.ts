import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class LayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.getUser();
  role = this.authService.getRole();

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}