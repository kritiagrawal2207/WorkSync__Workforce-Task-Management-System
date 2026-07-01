import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-emptystate',
  standalone: true,
  imports: [],
  templateUrl: './emptystatecomponent.html',
  styleUrl: './emptystatecomponent.css'
})
export class EmptyStateComponent {
  @Input() title = 'Nothing here yet';
  @Input() subtitle = '';
}