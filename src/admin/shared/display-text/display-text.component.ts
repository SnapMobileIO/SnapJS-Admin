import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-display-text',
  templateUrl: './display-text.component.html',
  styleUrls: ['./display-text.component.scss'],
})
export class DisplayTextComponent {
  @Input() field: string;
  @Input() value: any;
}
