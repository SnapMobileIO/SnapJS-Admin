import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AdminService } from '../admin.service';
import { ValidationService } from '../shared/control-errors/validation.service';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.scss'],
})
export class AdminEditComponent implements OnInit {
  object: any;
  submitFunction: Function;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastsManager,
    public adminService: AdminService,
    private validationService: ValidationService,
  ) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => {
        this.adminService.className = params.className;
        this.adminService.loadSchema();

        return this.adminService.getById(params.id);
      })
      .subscribe((object) => this.object = object);

    // Bind 'this' since the submit function is a callback
    this.submitFunction = this.submit.bind(this);
  }

  submit(form: FormGroup) {
    const object = form.value;
    if (object) {
      this.adminService.update(object)
        .then((response) => {
          this.router.navigate([`/admin/${this.adminService.className}`, object._id]);
        })
        .catch((err) => {
          const errors = err.json();
          this.toastr.error('There was an issue saving this.', 'Whoops!');
          this.validationService.buildServerErrors(form, errors);
        });
    }
  }
}
