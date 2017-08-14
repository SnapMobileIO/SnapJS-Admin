import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AdminService } from '../admin.service';
import { ValidationService } from '../shared/control-errors/validation.service';

@Component({
  selector: 'app-admin-new',
  templateUrl: './admin-new.component.html',
  styleUrls: ['./admin-new.component.scss'],
})
export class AdminNewComponent implements OnInit {
  object: {} = {};
  submitFunction: Function;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastsManager,
    public adminService: AdminService,
    private validationService: ValidationService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.adminService.className = params.className;
      this.adminService.loadSchema();
    });

    // Bind 'this' since the submit function is a callback
    this.submitFunction = this.submit.bind(this);
  }

  submit(form: FormGroup) {
    const object = form.value;
    if (object) {

      // Before submitting form we need to set any blank ObjectID fields to null
      // We can't send an empty string as an ObjectID
      for (let key in this.adminService.schema) {
        if ((!object[key] || !object[key].length) &&
          this.adminService.schema[key].instance === 'ObjectID' && key !== '_id') {
          object[key] = null;
        }
      }

      this.adminService.create(object)
        .then((response) => {
          this.router.navigate([`/admin/${this.adminService.className}`, response._id]);
        })
        .catch((err) => {
          const errors = err.json();
          this.toastr.error('There was an issue creating this.', 'Whoops!');
          this.validationService.buildServerErrors(form, errors);
        });
    }
  }
}
