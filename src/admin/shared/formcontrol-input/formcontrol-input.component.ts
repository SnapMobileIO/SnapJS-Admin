import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-formcontrol-input',
  templateUrl: './formcontrol-input.component.html',
  styleUrls: ['./formcontrol-input.component.scss'],
})
export class FormcontrolInputComponent {
  @Input() form: FormGroup;
  @Input() field: string;
  @Input() inputType: string = 'input';
}
