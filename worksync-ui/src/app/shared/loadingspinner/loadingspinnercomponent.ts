import { Component, Input } from '@angular/core';
import { APP_CONSTANTS } from '../../constants/string';
@Component({
  selector: 'app-loadingspinner',
  standalone: true,
  imports: [],
  templateUrl: './loadingspinnercomponent.html',
  styleUrl: './loadingspinnercomponent.css'
})
export class LoadingSpinnerComponent {
  readonly constants = APP_CONSTANTS;
  @Input() message = APP_CONSTANTS.LOADING_MESSAGE;
}