import { Component, Input } from '@angular/core';
import { constants } from '../../constants/string';
@Component({
  selector: 'app-loadingspinner',
  standalone: true,
  imports: [],
  templateUrl: './loadingspinnercomponent.html',
})
export class LoadingSpinnerComponent {
  readonly constants = constants;
  @Input() message = constants.LOADING_MESSAGE;
}