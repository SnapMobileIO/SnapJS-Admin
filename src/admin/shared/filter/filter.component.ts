import { Component, Input } from '@angular/core';
import { FormControl, FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { FilterService } from './filter.service';
import * as moment from 'moment';
const momentFunc = (moment as any).default;

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
    public filterService: FilterService,
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

  /**
   * Combines date and time values of filer
   */
  combineDateTime(filter) {
    let date = momentFunc(filter.date).format('YYYY-MM-DD');
    let time = momentFunc(filter.time).format('kk:mm:ss Z');

    // Subtracting 1 hour from time if it's DST because the database time won't account for this
    if (momentFunc(filter.date).isDST()) {
      time = momentFunc(filter.time).subtract(60, 'minutes').format('kk:mm:ss Z');
    }

    let dateTime = momentFunc(date + ' ' + time, 'YYYY-MM-DD HH:mm:ss Z').toISOString();
    filter.value = dateTime;
  }
}
