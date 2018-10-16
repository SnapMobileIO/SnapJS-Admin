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
  @Input() forEmbedded: boolean;

  constructor(
    private formBuilder: FormBuilder,
    public adminService: AdminService,
  ) {
  }

  ngOnInit() {
    if (!this.forEmbedded) {
      console.log('**** this is NOT for an embedded schema')
      this.form = new FormGroup({});
      this.adminService.parentForm = this.form;
    } else {
      console.log('**** this IS for an embedded schema')
      this.form = new FormGroup({});
    }

    // Set the schema keys
    if (this.schema) {
      this.schemaKeys = Object.keys(this.schema);
    }

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
      if ((this.schema[key].instanceOverride === 'Array' || this.schema[key].instance === 'Array') && this.schema[key].schema) {
        this.form.registerControl(key, this.formBuilder.array([]));

      } else if ((this.schema[key].instanceOverride === 'ImageArray' || this.schema[key].instance === 'ImageArray')
                  || (this.schema[key].instanceOverride === 'FileArray' || this.schema[key].instance === 'FileArray')) {
        this.form.registerControl(key, this.formBuilder.array([]));

      } else if (this.schema[key].instanceOverride === 'Embedded' || this.schema[key].instance === 'Embedded') {
        // Create a form group
        this.form.registerControl(key, new FormGroup({}));
        const parentFormGroup = <FormGroup> this.form.get(key);
        const schemaPaths = Object.keys(this.schema[key].schema.paths);

        // Create a control for each schema path
        schemaPaths.forEach((schemaPath) => {
          // For each path, set the value in the form or create another subgroupe if it's embedded
          this.buildEmbeddedGroup(parentFormGroup, schemaPath, this.schema[key].schema.obj[schemaPath])
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

        this.form.registerControl(key, new FormControl({value, disabled}, []));
      }
    });
    console.log('*** this.form', this.form)
  }

  /**
   * Check if the schema is an embedded schema
   * If it is, call this function again to build out recursive form groups
   * @param {any}    parentFormGroup The parent form group
   * @param {string} schemaPath      The name of the property we're adding to the form
   * @param {[type]} schema  The embedded schema we are adding to the form
   */
  buildEmbeddedGroup(parentFormGroup: FormGroup, schemaPath: string, schema: any) {
    if (schema && schema.obj) {
      parentFormGroup.registerControl(schemaPath, new FormGroup({}));
      const formGroup = <FormGroup> parentFormGroup.get(schemaPath);
      const childschemaPaths = Object.keys(schema.obj);
      childschemaPaths.forEach((childschemaPath) => {
        this.buildEmbeddedGroup(formGroup, childschemaPath, schema.obj[childschemaPath]);
      });
    } else {
      const value = '';
      parentFormGroup.registerControl(schemaPath, new FormControl(value));
    }
  }

  submit() {
    if (this.form.valid && this.submitFunction) {
      this.submitFunction(this.form);
    }
  }
}
