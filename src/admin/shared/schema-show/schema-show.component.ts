import { Component, Input } from '@angular/core';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-schema-show',
  templateUrl: './schema-show.component.html',
  styleUrls: ['./schema-show.component.scss'],
})
export class SchemaShowComponent {
  @Input() object: any;
  @Input() schema: any;

  constructor(
    public adminService: AdminService,
  ) { }
}
