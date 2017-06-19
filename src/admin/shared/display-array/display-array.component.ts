import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-display-array',
  templateUrl: './display-array.component.html',
  styleUrls: ['./display-array.component.scss'],
})
export class DisplayArrayComponent {
  @Input() field: string;
  @Input() value: any;
}
