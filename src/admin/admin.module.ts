import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SelectModule } from 'ng2-select';
// import { TagInputModule } from 'ng2-tag-input';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { ControlErrorsModule } from './shared/control-errors/control-errors.module';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminDetailComponent } from './admin-detail/admin-detail.component';
import { AdminEditComponent } from './admin-edit/admin-edit.component';
import { AdminFormComponent } from './admin-form/admin-form.component';
import { AdminNewComponent } from './admin-new/admin-new.component';
import { FormcontrolInputComponent } from './shared/formcontrol-input/formcontrol-input.component';
import { FormcontrolSelectRelComponent } from './shared/formcontrol-select-rel/formcontrol-select-rel.component';
import { FormcontrolSelectComponent } from './shared/formcontrol-select/formcontrol-select.component';
import { FormcontrolArrayComponent } from './shared/formcontrol-array/formcontrol-array.component';
import { FormcontrolArrayRelComponent } from './shared/formcontrol-array-rel/formcontrol-array-rel.component';
import { FormcontrolGroupComponent } from './shared/formcontrol-group/formcontrol-group.component';
import { FormcontrolTinymceComponent } from './shared/formcontrol-tinymce/formcontrol-tinymce.component';
import { FormControlFileUploadComponent } from './shared/formcontrol-file-upload/formcontrol-file-upload.component';
import { ProgressBarComponent } from './shared/progress-bar/progress-bar.component';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminService } from './admin.service';
import { ConstantsService } from './constants.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    SelectModule,
    // TagInputModule,
    AdminRoutingModule,
    ControlErrorsModule,
    ToastModule.forRoot(),
    NgbModule.forRoot(),
  ],
  declarations: [
    AdminListComponent,
    AdminDetailComponent,
    AdminEditComponent,
    AdminFormComponent,
    AdminNewComponent,
    FormcontrolInputComponent,
    FormcontrolSelectRelComponent,
    FormcontrolSelectComponent,
    FormcontrolArrayComponent,
    FormcontrolArrayRelComponent,
    FormcontrolGroupComponent,
    FormcontrolTinymceComponent,
    FormControlFileUploadComponent,
    ProgressBarComponent,
    FileSelectDirective,
    FileDropDirective,
    AdminLayoutComponent,
  ],
  providers: [
    AdminService,
    ConstantsService,
  ],
})
export class SnapJSAdminModule {
  /**
   * You can use your own ConstantsService for the admin portal
   * You should at a minimum, make sure to include all of the properties
   * in /constants.service.ts
   * @param  {any}                 constantsService The class to overwrite ConstantsService
   */
   static forRoot(constantsService: any): ModuleWithProviders {
    return {
      ngModule: SnapJSAdminModule,
      providers: [{provide: ConstantsService, useClass: constantsService }]
    };
  }
}
