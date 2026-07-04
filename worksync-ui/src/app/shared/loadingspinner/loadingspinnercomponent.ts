import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-loadingspinner',
  standalone: true,
  imports: [],
  templateUrl: './loadingspinnercomponent.html',
})
export class LoadingSpinnerComponent {
  @Input() message = 'Loading...';
}