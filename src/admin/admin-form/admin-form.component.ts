import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.scss'],
})
export class AdminFormComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  formSubmitted: boolean = false;
  schemaKeys: any[] = [];
  @Input() object: any = {};
  @Input() schema: any = {};
  @Input() submitFunction: Function;

  constructor(
    private formBuilder: FormBuilder,
    public adminService: AdminService,
  ) { }

  ngOnInit() {
    if (this.schema) {
      this.schemaKeys = Object.keys(this.schema);
    }

    // Remove hidden keys
    let i = this.schemaKeys.length;
    while (i--) {
      if (this.schema[this.schemaKeys[i]].instance === 'Remove') {
        delete this.schema[this.schemaKeys[i]];
        this.schemaKeys.splice(i, 1);
      }
    }

    // Build Form
    this.schemaKeys.forEach((key) => {
      if (this.schema[key].instance === 'Array' && this.schema[key].schema) {
        this.form.registerControl(key, this.formBuilder.array([]));

      } else if (this.schema[key].instance === 'ImageArray' || this.schema[key].instance === 'FileArray') {
        this.form.registerControl(key, this.formBuilder.array([]));

      } else if (this.schema[key].instance === 'Embedded') {
        this.form.registerControl(key, new FormGroup({}));
        const formGroup = <FormGroup>this.form.controls[key];
        const schemaPaths = Object.keys(this.schema[key].schema.paths);
        schemaPaths.forEach((schemaPath) => {
          const value = this.object[key] && this.object[key][schemaPath] ? this.object[key][schemaPath] : '';
          formGroup.registerControl(schemaPath, new FormControl(value));
        });

      } else {
        let value = '';

        // If the key has a period, this is a relationship
        if (key.indexOf('.') >= 0) {
          const array = key.split('.');
          if (this.object[array[0]] && this.object[array[0]][array[1]]) {
            value = this.object[array[0]][array[1]];
          }

        } else if (this.object[key]) {
          value = this.object[key];
        }

        // Set the field to disabled if overwritten in config
        let disabled = this.schema[key].instance === 'Disabled' ? true : false;

        // this.form.registerControl(key, new FormControl({value, disabled}, [Validators.required]));
        this.form.registerControl(key, new FormControl({value, disabled}, []));
      }
    });
  }

  submit() {
    if (this.form.valid && this.submitFunction) {
      this.submitFunction(this.form);
    }
  }
}
