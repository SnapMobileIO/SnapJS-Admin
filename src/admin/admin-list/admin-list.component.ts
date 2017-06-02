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

  findAll(): void {
    this.adminService.query()
      .then((response) => {
        this.objects = response.items;
      });
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
}
