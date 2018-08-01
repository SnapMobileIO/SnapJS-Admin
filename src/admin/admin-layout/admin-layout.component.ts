import { Component } from '@angular/core';
import { ConstantsService } from '../constants.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent {
  isCollapsed = true;

  constructor(
    public constants: ConstantsService,
  ) { }

  /**
   * Checks if the user is logged in
   */
  isLoggedIn() {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }
}
