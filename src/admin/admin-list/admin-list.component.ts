import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { AdminService } from '../admin.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public adminService: AdminService,
    private toastr: ToastsManager,
    private vRef: ViewContainerRef,
  ) {
    this.toastr.setRootViewContainerRef(vRef);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.adminService.className = params.className;
      this.adminService.loadSchema()
        .then((response) => {
          this.findAll();
        });
    });
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

}
