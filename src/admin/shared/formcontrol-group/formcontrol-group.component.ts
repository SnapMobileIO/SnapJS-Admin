import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-formcontrol-group',
  templateUrl: './formcontrol-group.component.html',
  styleUrls: ['./formcontrol-group.component.scss'],
})
export class FormcontrolGroupComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() field: string;
  @Input() schema: any;
  schemaKeys: any[];

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.schemaKeys = Object.keys(this.schema.paths);
  }

}
