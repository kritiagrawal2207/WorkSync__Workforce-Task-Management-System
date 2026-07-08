import { Component, Input } from '@angular/core';
import { constants } from '../../constants/string';
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [],
  templateUrl: './emptystatecomponent.html',
})
export class EmptyStateComponent {
  protected readonly constants = constants;
  @Input() title = constants.EMPTY_STATE_TITLE;
  @Input() subtitle = constants.EMPTY_STATE_SUBTITLE;
}