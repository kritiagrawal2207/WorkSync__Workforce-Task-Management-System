import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-emptystate',
  standalone: true,
  imports: [],
  templateUrl: './emptystatecomponent.html',
})
export class EmptyStateComponent {
  @Input() title = 'Nothing here yet';
  @Input() subtitle = '';
}