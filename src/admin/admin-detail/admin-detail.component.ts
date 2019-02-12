import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AdminService } from '../admin.service';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-admin-detail',
  templateUrl: './admin-detail.component.html',
  styleUrls: ['./admin-detail.component.scss'],
})
export class AdminDetailComponent implements OnInit {
  object: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public adminService: AdminService,
  ) { }

  ngOnInit(): void {
    console.log('hey hey hey');
    this.route.params
      .switchMap((params: Params) => {
        this.adminService.className = params.className;
        this.adminService.loadSchema();

        return this.adminService.getById(params.id);
      })
      .subscribe((object) => this.object = object);
  }

  deleteItem(object: any) {
    this.adminService.delete(object)
      .then((response) => {
        this.router.navigate([`/admin/${this.adminService.className}`]);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
