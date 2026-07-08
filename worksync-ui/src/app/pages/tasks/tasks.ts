import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { constants } from '../../constants/string';
@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class TasksComponent {
  constants: any;
}