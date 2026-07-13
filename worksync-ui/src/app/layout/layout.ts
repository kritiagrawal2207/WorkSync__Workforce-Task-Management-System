import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthUser } from '../models/auth.model';
import { constants } from '../constants/string';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './layout.html',
})
export class LayoutComponent {
  user: AuthUser | null;
  role: string;
  isDashboard = false; 
  protected readonly constants = constants;
  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getUser();
    this.role = this.authService.getRole();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isDashboard = event.urlAfterRedirects === '/dashboard';
      }
    });
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}