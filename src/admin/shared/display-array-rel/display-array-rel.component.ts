import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-display-array-rel',
  templateUrl: './display-array-rel.component.html',
  styleUrls: ['./display-array-rel.component.scss'],
})
export class DisplayArrayRelComponent {
  @Input() field: string;
  @Input() displayKey: string;
  @Input() className: string;
  @Input() value: any;
}
