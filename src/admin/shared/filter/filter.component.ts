import { Component, Input } from '@angular/core';
import { FormControl, FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { FilterService } from './filter.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})

export class FilterComponent {
  @Input() filters: any[];
  @Input() schema: any;
  @Input() findAll: Function;
  @Input() itemsPerPage: number;
  @Input() skip: number;
  @Input() sort: string;
  form: FormGroup = new FormGroup({});

  constructor(
    public adminService: AdminService,
    public filterService: FilterService
  ) {}

  addFilters() {
    console.log('** add filters')
  }

  submit() {
    console.log('*** submitting form')
  }

  clearFilters() {
    console.log('**** clearing filters')
  }
}
