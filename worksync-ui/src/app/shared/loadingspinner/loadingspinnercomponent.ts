import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-loadingspinner',
  standalone: true,
  imports: [],
  templateUrl: './loadingspinnercomponent.html',
  styleUrl: './loadingspinnercomponent.css'
})
export class LoadingSpinnerComponent {
  @Input() message = 'Loading...';
}