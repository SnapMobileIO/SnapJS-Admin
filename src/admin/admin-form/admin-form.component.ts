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
      if (this.schema[this.schemaKeys[i]].instanceOverride === 'Remove' ||
          this.schema[this.schemaKeys[i]].instanceOverride === 'Hidden') {
        delete this.schema[this.schemaKeys[i]];
        this.schemaKeys.splice(i, 1);
      }
    }

    // Build Form
    this.schemaKeys.forEach((key) => {
      if ((this.schema[key].instanceOverride === 'Array' || this.schema[key].instance === 'Array') && this.schema[key].schema) {
        this.form.registerControl(key, this.formBuilder.array([]));

      } else if ((this.schema[key].instanceOverride === 'ImageArray' || this.schema[key].instance === 'ImageArray')
                  || (this.schema[key].instanceOverride === 'FileArray' || this.schema[key].instance === 'FileArray')) {
        this.form.registerControl(key, this.formBuilder.array([]));

      } else if (this.schema[key].instanceOverride === 'Embedded' || this.schema[key].instance === 'Embedded') {
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
        let disabled;
        if (this.schema[key].instanceOverride === 'Disabled') {
          disabled = true;
        } else if (this.schema[key].instanceOptions && this.schema[key].instanceOptions.disabled) {
          disabled = true;
        } else {
          disabled = false;
        }

        // this.form.registerControl(key, new FormControl({value, disabled}, [Validators.required]));
        this.form.registerControl(key, new FormControl({value, disabled}, []));
      }
    });
  }

  submit() {
    if (this.form.valid && this.submitFunction) {

      // Before submitting form we need to set any blank ObjectID fields to null
      // We can't send an empty string as an ObjectID
      for (let key in this.adminService.schema) {
        if ((!this.form.value[key] || !this.form.value[key].length) &&
          this.adminService.schema[key].instance === 'ObjectID' && key !== '_id') {
          this.form.value[key] = null;
        }
      }
      this.submitFunction(this.form);
    }
  }
}
