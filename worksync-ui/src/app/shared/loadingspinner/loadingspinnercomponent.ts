import { Component, Input } from '@angular/core';
import { constants } from '../../constants/string';
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [],
  templateUrl: './loadingspinnercomponent.html',
})
export class LoadingSpinnerComponent {
  protected readonly constants = constants;
  @Input() message = constants.LOADING_MESSAGE;
}