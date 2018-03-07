import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { FormControl, FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ConstantsService } from '../constants.service';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss'],
})
export class AdminListComponent implements OnInit {
  objects: any;
  totalObjects: Number;
  params: any = { skip: 0, sort: '-createdAt' };
  itemsPerPage = 20;
  currentPage = 1;
  selectAll: boolean;
  selectedItems: any[] = [];
  filterToggle: boolean;
  toggle: any = {};
  form: FormGroup = new FormGroup({});
  uploadedFile: '';
  importLoading: boolean;
  importToggle: boolean;
  filters: any[] = [{ field: '', operator: '', value: '' }];
  filterFunction: Function;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public adminService: AdminService,
    private toastr: ToastsManager,
    private vRef: ViewContainerRef,
    private constants: ConstantsService,
  ) {
    this.toastr.setRootViewContainerRef(vRef);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      // Clear out filter
      this.resetFilters();

      this.adminService.className = params.className;
      this.adminService.loadSchema()
        .then((response) => {
          this.findAll();
        });
    });

    // Bind 'this' since the submit function is a callback
    this.filterFunction = this.findAll.bind(this);
  }

  findAll(params?: any): void {
    this.selectAll = false;
    this.selectedItems = [];
    this.params = params || { limit: this.itemsPerPage, skip: this.params.skip, sort: this.params.sort };

    this.adminService.query(this.params)
      .then((response) => {
        this.totalObjects = response.itemCount;
        this.objects = response.items;
      });
  }

  /**
   * Handles pagination of items
   */
  pageChanged() {
    this.params.skip = this.itemsPerPage * (this.currentPage - 1);
    this.findAll(this.params);
    this.selectAll = false;
    this.selectedItems = [];
  }

  deleteItem(object: any) {
    if (window.confirm('Are you sure you want to delete')) {
      this.adminService.delete(object)
        .then(() => {
          this.findAll();
          this.toastr.success('Successfully deleted.', 'Success!');
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  deleteMultiple(objectIds: string[]) {
    if (window.confirm('Are you sure?')) {
      this.adminService.deleteMultiple(objectIds)
        .then((response) => {
          this.selectedItems = [];
          this.findAll();
          this.toastr.success('Successfully deleted');
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      this.clearSelections();
    }
  }

  /**
   * Clear out all selected items
   */
  clearSelections() {
    this.selectAll = false;
    this.selectedItems = [];
    this.objects.forEach((object) => {
      object.Selected = false;
    });
  }

  /**
   * Toggle the selectAll property and mark each object as selected/deselected
   */
  toggleAllSelection() {
    this.selectAll = !this.selectAll;
    this.selectedItems = this.objects.map((object) => {
      object.Selected = this.selectAll;
      return object._id;
    });

    if (!this.selectAll) { this.selectedItems = []; };
  }

  /**
   * Toggle an individual items selected property
   * @param {string} objectId The selected item's id
   */
  toggleSelection(objectId: string) {
    let index = this.selectedItems.indexOf(objectId);
    index >= 0 ? this.selectedItems.splice(index, 1) : this.selectedItems.push(objectId);
    this.selectAll = this.selectedItems.length === this.objects.length;
  };

  /**
   * Updates and reruns findAll() to sort objects based on key and asc / desc
   * The toggle state is tracked so that the UI can be udpated
   * @param  {String} key The key to sort by
   */
  updateSort(key: string) {
    let isDesc = !!this.params.sort.lastIndexOf('-', 0);
    this.params.sort = isDesc ? `-${key}` : key;
    this.toggle[key] = !isDesc;
    this.findAll(this.params);
  }

  /**
   * Direct user to URL that exports data to a CSV file
   */
  exportToCsv() {
    const token = localStorage.getItem('token');
    let exportUrl = `${this.constants.API_BASE_URL}/admin/${this.adminService.className}?export=true&access_token=${token}&`;

    // Remove limit and skip from the params for a csv export
    let exportParams = this.params;
    delete exportParams.skip;
    delete exportParams.limit;

    // Serialize params
    exportUrl += this.adminService.serializeParams(this.params).toString();
    window.open(exportUrl);
  }

  /**
   * Listens to the event emitter and sets the uploadedFile
   * @param event 
   */
  updateFile(event: any) {
    this.uploadedFile = event;
  }

  /**
   * Switches the importToggle and resets the uploaded file
   */
  toggleImport() {
    this.uploadedFile = '';
    if (this.importToggle) {
      this.importToggle = false;
    } else {
      this.importToggle = true;
    }
  }

  /**
   * Imports the csv file.
   */
  importFromCsv() {
    // Checks for existence of a file
    if (this.uploadedFile !== '') {
      this.importLoading = true;
      this.adminService.importFromCsv(this.uploadedFile)
        .then(response => {
          this.findAll();
          this.importLoading = false;
          this.importToggle = false;
          this.uploadedFile = '';
          this.toastr.success('Successfully imported');
        }, (error) => {
          this.findAll();
          this.importLoading = false;
          this.importToggle = false;
          this.uploadedFile = '';

          const message = this.buildServerErrors(error) || 'Import Error';
          this.toastr.error(message, null, { enableHTML: true });
        });
    } else {
      this.toastr.error('You need to upload a file before importing');
    }
  }

  /**
   * Sets the import toggle to false and resets the uploaded file
   */
  cancelImport() {
    this.importToggle = false;
    this.uploadedFile = '';
  }


  /**
   * Clear filter and manage filterToggle
   */
  resetFilters() {
    this.filters = [{ field: '', operator: '', value: '' }];
    this.filterToggle = false;
  }

  /**
   * Build error string from server errors
   * @param {any} error The error object
   */
  buildServerErrors(error: any) {
    let errorMessage = '';
    const errors = error.json().errors;

    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        const message = errors[key].message;
        errorMessage += `${message}</br>`;
      }
    }

    return errorMessage;
  }

}
