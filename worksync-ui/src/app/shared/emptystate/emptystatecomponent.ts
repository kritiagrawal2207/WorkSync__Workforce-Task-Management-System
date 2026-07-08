import { Component, Input } from '@angular/core';
import { constants } from '../../constants/string';
@Component({
  selector: 'app-emptystate',
  standalone: true,
  imports: [],
  templateUrl: './emptystatecomponent.html',
})
export class EmptyStateComponent {
  
  @Input() title = constants.EMPTY_STATE_TITLE;
  @Input() subtitle = constants.EMPTY_STATE_SUBTITLE;
}