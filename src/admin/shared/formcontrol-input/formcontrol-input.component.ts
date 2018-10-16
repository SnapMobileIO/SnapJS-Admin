import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-formcontrol-input',
  templateUrl: './formcontrol-input.component.html',
  styleUrls: ['./formcontrol-input.component.scss'],
})
export class FormcontrolInputComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() field: string;
  @Input() displayName: string;
  @Input() inputType = 'input';
  @Input() forEmbedded: boolean;
  @Input() embeddedGroupName: string;

  constructor(
    public adminService: AdminService,
  ) {}

  ngOnInit() {
    // console.log('*** field: ', this.field)
    // console.log('*** FORM IN FORMCONTROL-INPUT COMPONENT', this.adminService.parentForm)
  }

  /**
   * Update the form value for a boolean instance
   * @param {any} formControlValue the form control value - should be a boolean or blank string
   */
  updateFormValue(formControlValue: any) {
    if (this.inputType === 'checkbox') {
      formControlValue = !formControlValue;

      this.form.patchValue({
        [this.field]: formControlValue,
      });
    }
  }
}
