import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-display-single-rel',
  templateUrl: './display-single-rel.component.html',
  styleUrls: ['./display-single-rel.component.scss'],
})
export class DisplaySingleRelComponent {
  @Input() field: string;
  @Input() displayKey: string;
  @Input() className: string;
  @Input() value: any;
}
