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
  query: any;

  constructor(
    public adminService: AdminService,
    public filterService: FilterService,
  ) {}

  addFilters() {
    this.filters.push({ field: '', operator: '', value: '' });
  }

  /**
   * Calls findAll passing the query filters
   * Must be called as a seperate function in order for it to hit the parent controller
   */
  findAllWithFilters() {
    this.query = this.filterService.buildQuery(this.filters, this.itemsPerPage, this.skip, this.sort);
    this.findAll(this.query);
  }

  /**
   * Calls findAll function from parent controller to reset filters
   * Must be called as a seperate function in order for it to hit the parent controller
   */
  resetFilters() {
    this.findAll();
  }

  /**
   * Removes filters from search and displays all companies
   * Setting this.filters.length to 0 so it empties the parent filters as well
   * Adding the first empty filter back in
   */
  clearFilters() {
    this.filters.length = 0;
    this.addFilters();
    this.resetFilters();
    window.history.pushState({}, document.title, window.location.href.split('?')[0]);
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
