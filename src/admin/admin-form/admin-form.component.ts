import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';
import * as moment from 'moment';

@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.scss'],
})
export class AdminFormComponent implements OnInit {
  form: any;
  formSubmitted: boolean = false;
  schemaKeys: any[] = [];
  @Input() object: any = {};
  @Input() schema: any = {};
  @Input() submitFunction: Function;
  @Input() embeddedGroupName: string;
  @Input() originalForm: any;

  constructor(
    private formBuilder: FormBuilder,
    public adminService: AdminService,
  ) {
  }

  ngOnInit() {
    // if (this.originalForm) {
    //   console.log('*** use original form')
    //   this.form = this.originalForm;
    // } else {
    //   console.log('*** new blank form')
    //   this.form = new FormGroup({});
    // }

    if (this.schema) {
      this.schemaKeys = Object.keys(this.schema);
    }
    this.form = new FormGroup({});

    // Remove hidden keys
    let i = this.schemaKeys.length;
    while (i--) {
      if (this.schema[this.schemaKeys[i]].instanceOverride === 'Remove') {
        delete this.schema[this.schemaKeys[i]];
        this.schemaKeys.splice(i, 1);
      }
    }

    // Build Form
    this.schemaKeys.forEach((key) => {
      console.log('*** this.schema[key]', this.schema[key])
      if ((this.schema[key].instanceOverride === 'Array' || this.schema[key].instance === 'Array') && this.schema[key].schema) {
        this.form.registerControl(key, this.formBuilder.array([]));

      } else if ((this.schema[key].instanceOverride === 'ImageArray' || this.schema[key].instance === 'ImageArray')
                  || (this.schema[key].instanceOverride === 'FileArray' || this.schema[key].instance === 'FileArray')) {
        this.form.registerControl(key, this.formBuilder.array([]));

      } else if (this.schema[key].instanceOverride === 'Embedded' || this.schema[key].instance === 'Embedded') {
        this.form.registerControl(key, new FormGroup({}));
        const parentFormGroup = <FormGroup> this.form.get(key);
        const schemaPaths = Object.keys(this.schema[key].schema.paths);
        schemaPaths.forEach((schemaPath) => {

          if (this.schema[key].schema.obj[schemaPath] && this.schema[key].schema.obj[schemaPath].obj) {
            parentFormGroup.registerControl(schemaPath, new FormGroup({}));
            const formGroup = <FormGroup> parentFormGroup.get(schemaPath);
            const childschemaPaths = Object.keys(this.schema[key].schema.obj[schemaPath].obj);
            childschemaPaths.forEach((childschemaPath) => {
              const value = this.object[key] && this.object[key][childschemaPath] ? this.object[key][childschemaPath] : '';
              formGroup.registerControl(childschemaPath, new FormControl(value));
            });
          } else {
            const value = this.object[key] && this.object[key][schemaPath] ? this.object[key][schemaPath] : '';
            parentFormGroup.registerControl(schemaPath, new FormControl(value));
          }
        });
      } else {
        let value = '';

        // If the key has a period, this is a relationship
        if (key.indexOf('.') >= 0) {
          const array = key.split('.');
          if (this.object[array[0]] && this.object[array[0]][array[1]]) {
            value = this.object[array[0]][array[1]];
          }

        } else if (this.object[key] && this.schema[key].instance === 'Date') {
          // If this is a date we need to format it as a string
          value = moment(this.object[key]).format('YYYY-MM-DDTHH:mm');
        } else if (this.object[key] && this.schema[key].instance !== 'Date') {
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

    console.log("*** this.form", this.form)
  }

  submit() {
    console.log('**** this.form', this.form)
    if (this.form.valid && this.submitFunction) {
      this.submitFunction(this.form);
    }
  }
}
