import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-formcontrol-array',
  templateUrl: './formcontrol-array.component.html',
  styleUrls: ['./formcontrol-array.component.scss'],
})
export class FormcontrolArrayComponent {
  @Input() form: FormGroup;
  @Input() field: string;
  @Input() displayName: string;
}
