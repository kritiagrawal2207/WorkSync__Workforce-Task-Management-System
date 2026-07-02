import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AuthUser } from '../shared/models/auth.model';
import { LAYOUT_TEXT } from '../shared/constants/ui-strings';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class LayoutComponent {
  readonly strings = LAYOUT_TEXT;
  user: AuthUser | null;
  role: string;
  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getUser();
    this.role = this.authService.getRole();
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}