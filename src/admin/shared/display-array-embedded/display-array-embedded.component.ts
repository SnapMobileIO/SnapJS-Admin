import { Component, Input } from '@angular/core';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-display-array-embedded',
  templateUrl: './display-array-embedded.component.html',
  styleUrls: ['./display-array-embedded.component.scss'],
})
export class DisplayArrayEmbeddedComponent {
  @Input() value: any;
  @Input() key: string;

  constructor(
    public adminService: AdminService,
  ) { }
}
