import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-formcontrol-array-rel',
  templateUrl: './formcontrol-array-rel.component.html',
  styleUrls: ['./formcontrol-array-rel.component.scss'],
})
export class FormcontrolArrayRelComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() object: {};
  @Input() field: string;
  @Input() schema: any;
  schemaKeys: any[];

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.schemaKeys = Object.keys(this.schema.paths);

    // Remove _id from schemaKeys if it exists
    const idIndex = this.schemaKeys.indexOf('_id');
    if (idIndex > -1) {
      this.schemaKeys.splice(idIndex, 1);
    }

    if (this.object[this.field]) {
      this.object[this.field].map((item) => {
        this.addItem(item);
      });
    }
  }

  initItem(item: any = {}) {
    const formGroup = this.formBuilder.group({});

    this.schemaKeys.forEach((key) => {
      formGroup.registerControl(key, new FormControl(item[key] || ''));
    });

    return formGroup;
  }

  addItem(item: any = {}) {
    const control = <FormArray>this.form.controls[this.field];
    control.push(this.initItem(item));
  }

  removeItem(i: number) {
    const control = <FormArray>this.form.controls[this.field];
    control.removeAt(i);
  }

}
