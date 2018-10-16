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
  form: FormGroup = new FormGroup({});
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
  ) {}

  ngOnInit() {
    // Set schema keys
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

    // If this is an edit - set adminService.object to the object
    // If this is not embedded, build the object
    if (Object.keys(this.object).length > 0) {
      this.adminService.object = this.object;
    } else if (!this.forEmbedded) {
      this.adminService.object = {};
      this.buildObject();
    }
    console.log('*** object', this.adminService.object)
  }

  buildObject() {
    this.schemaKeys.forEach((key) => {
      if ((this.schema[key].instanceOverride === 'Array' || this.schema[key].instance === 'Array') && this.schema[key].schema) {
        this.adminService.object[key] = [];
      } else if ((this.schema[key].instanceOverride === 'ImageArray' || this.schema[key].instance === 'ImageArray')
                  || (this.schema[key].instanceOverride === 'FileArray' || this.schema[key].instance === 'FileArray')) {
        this.adminService.object[key] = [];
      } else if (this.schema[key].instanceOverride === 'Embedded' || this.schema[key].instance === 'Embedded') {
        this.adminService.object[key] = {};
        const parentFormGroup = this.adminService.object[key];
        const schemaPaths = Object.keys(this.schema[key].schema.paths);

        // Create an object for each schema path
        schemaPaths.forEach((schemaPath) => {
          // For each path, set the value in the form or create another subgroupe if it's embedded
          this.buildEmbeddedGroup(parentFormGroup, schemaPath, this.schema[key].schema.obj[schemaPath])
        });
      } else {
        let value = '';

        // If the key has a period, this is a relationship
        if (key.indexOf('.') >= 0) {
          const array = key.split('.');
          if (this.adminService.object[array[0]] && this.adminService.object[array[0]][array[1]]) {
            value = this.adminService.object[array[0]][array[1]];
          }

        } else if (this.adminService.object[key] && this.schema[key].instance === 'Date') {
          // If this is a date we need to format it as a string
          value = moment(this.adminService.object[key]).format('YYYY-MM-DDTHH:mm');
        } else if (this.adminService.object[key] && this.schema[key].instance !== 'Date') {
          value = this.adminService.object[key];
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

        // this.form.registerControl(key, new FormControl({value, disabled}, []));
        this.adminService.object[key] = value;
      }
    });
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
      parentFormGroup[schemaPath] = {};
      const formGroup = parentFormGroup[schemaPath];
      const childschemaPaths = Object.keys(schema.obj);
      childschemaPaths.forEach((childschemaPath) => {
        this.buildEmbeddedGroup(formGroup, childschemaPath, schema.obj[childschemaPath]);
      });
    } else {
      const value = '';
      parentFormGroup[schemaPath] = value;
    }
  }

  getModelPath() {
  }

  submit() {
    console.log('*** ', this.adminService.object)
    if (this.form.valid && this.submitFunction) {
      this.submitFunction(this.form);
    }
  }
}
