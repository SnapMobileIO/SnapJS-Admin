import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-display-single-rel',
  templateUrl: './display-single-rel.component.html',
  styleUrls: ['./display-single-rel.component.scss'],
})
export class DisplaySingleRelComponent {
  @Input() field: string;
  @Input() searchField: string;
  @Input() searchClass: string;
  @Input() value: any;
}
