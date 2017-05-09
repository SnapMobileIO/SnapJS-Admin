import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { AdminService } from '../admin.service';

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
  ) { }

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
}
