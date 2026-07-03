import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TASKS_TEXT } from '../../constants/string';
@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class TasksComponent {
  readonly strings = TASKS_TEXT;
}