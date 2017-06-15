import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-display-array-rel',
  templateUrl: './display-array-rel.component.html',
  styleUrls: ['./display-array-rel.component.scss'],
})
export class DisplayArrayRelComponent {
  @Input() field: string;
  @Input() searchField: string;
  @Input() searchClass: string;
  @Input() value: any;
}
