import { Component, Input } from '@angular/core';
import { APP_CONSTANTS } from '../../constants/string';
@Component({
  selector: 'app-emptystate',
  standalone: true,
  imports: [],
  templateUrl: './emptystatecomponent.html',
  styleUrl: './emptystatecomponent.css'
})
export class EmptyStateComponent {
  readonly constants = APP_CONSTANTS;
  @Input() title = APP_CONSTANTS.EMPTY_STATE_TITLE;
  @Input() subtitle = APP_CONSTANTS.EMPTY_STATE_SUBTITLE;
}