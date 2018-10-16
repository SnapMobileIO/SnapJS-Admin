import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-formcontrol-input',
  templateUrl: './formcontrol-input.component.html',
  styleUrls: ['./formcontrol-input.component.scss'],
})
export class FormcontrolInputComponent {
  @Input() field: string;
  @Input() displayName: string;
  @Input() inputType = 'input';
  @Input() embeddedGroupName: string;
  @Input() forEmbedded: boolean;
  @Input() modelPath: string;

  constructor(
    public adminService: AdminService,
  ) {}
}
