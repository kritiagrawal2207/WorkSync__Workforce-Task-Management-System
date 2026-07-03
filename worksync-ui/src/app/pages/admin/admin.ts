import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
const ADMIN_TEXT = {
  title:    'Admin',
  subtitle: 'System administration panel.',
};
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class AdminComponent {
  readonly strings = ADMIN_TEXT;
}