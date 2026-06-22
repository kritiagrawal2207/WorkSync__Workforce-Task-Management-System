import { Component, Input } from '@angular/core';
import { COMMON_TEXT } from '../../constants/ui-strings';

@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './loader.html',
  styleUrl: './loader.css'
})
export class LoaderComponent {
  @Input() message = COMMON_TEXT.loading;
}