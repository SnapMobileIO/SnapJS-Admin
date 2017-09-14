import { Component, Input, OnInit, ChangeDetectorRef }   from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { File } from './file';
import { ConstantsService } from '../../constants.service';

@Component({
  selector: 'app-formcontrol-file-upload',
  template: `
    <div [formGroup]="form" class="row">

      <!-- Images -->
      <div *ngIf="!isMultiple">
        <label class="col-sm-2 control-label">{{displayName}}:</label>

        <div *ngIf="form.controls[field].value">
          <div *ngIf="form.controls[field].value.url">
            <img *ngIf="isImage(form.controls[field].value.type)" src="{{constants.AWS_S3_BASE_URL}}/{{form.controls[field].value.url}}" style="max-width: 200px; max-height: 200px;">
            <a *ngIf="!isImage(form.controls[field].value.type)" href="{{constants.AWS_S3_BASE_URL}}/{{form.controls[field].value.url}}" target="_blank">{{form.controls[field].value.name}}</a>
          </div>
        </div>

        <div class="col-sm-offset-2 col-sm-10" *ngIf="!form.controls[field].disabled">
          <span *ngIf="form.value[field].name" (click)="form.value[field] = {}">Remove</span>
        </div>
      </div>

      <!-- Multiple images -->
      <div *ngIf="isMultiple">
        <div [formArrayName]="field">
          <label for="name" class="col-sm-2 control-label">{{field}}:</label>
          <div *ngIf="form.controls[field]" class="col-sm-10">
            <div *ngFor="let item of form.controls[field].controls; let i = index; ">
              <div *ngIf="item.controls.url">
                <img *ngIf="isImage(item.controls.type.value)" src="{{constants.AWS_S3_BASE_URL}}/{{item.controls.url.value}}" style="max-width: 200px; max-height: 200px;">
                <a *ngIf="!isImage(item.controls.type.value)" href="{{constants.AWS_S3_BASE_URL}}/{{item.controls.url.value}}" target="_blank">{{item.controls.name.value}}</a>

                <!-- Remove -->
                <p (click)="removeItem(i, field)">Remove</p>
              </div>
              <div [formGroupName]="i"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upload form -->
      <div class="col-sm-offset-2 col-sm-10" *ngIf="!form.controls[field].disabled">
    	 <input type="file" ng2FileSelect [uploader]="uploader" multiple="isMultiple" />
        <p *ngIf="errorMessage">{{errorMessage}}</p>
      </div>

      <!-- Display uploaded image and progress -->
      <div *ngFor="let item of uploader.queue" class="col-sm-offset-2 col-sm-10">
        <div *ngIf="!item.isSuccess">
          <p>{{item.file.name}}</p>

          <progress-bar [progress]=item.progress></progress-bar>
          Progress: {{item.progress}}%

          <p *ngIf="item.isUploading">Uploading</p>
          <p *ngIf="item.isSuccess">Uploaded</p>
          <p *ngIf="item.isError">Error</p>
        </div>
      </div>

      <!-- Upload button -->
      <div class="col-sm-offset-2 col-sm-10" *ngIf="!form.controls[field].disabled">
        <button type="button" class="btn btn-success btn-s" (click)="uploader.uploadAll()" [disabled]="!uploader.getNotUploadedItems().length">
          <span class="glyphicon glyphicon-upload"></span> Upload
        </button>
      </div>

    </div>
  `,
  styles: [`
    .my-drop-zone{border:dotted 3px lightgray}.nv-file-over{border:dotted 3px red}
  `],
})
export class FormControlFileUploadComponent implements OnInit {
  @Input() isMultiple: boolean;
  @Input() form: any;
  @Input() field: string;
  @Input() displayName: string;
  @Input() object: {};
  @Input() allowedMimeType?: string[];
  @Input() maxFileSize?: number;
  files: File[] = [];
  errorMessage: string;
  uploader: FileUploader;

  constructor(
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private constants: ConstantsService,
  ) {}

  ngOnInit(): void {
    // Create uploader instance with options
    // Options are here...
    // https://github.com/valor-software/ng2-file-upload/blob/master/components/file-upload/file-uploader.class.ts
    this.uploader = new FileUploader({
      url: `${this.constants.API_BASE_URL}/aws/uploadToAws`,
      allowedMimeType: this.allowedMimeType || this.constants.FILE_UPLOAD_DEFAULT_ALLOWED_MIME_TYPES,
      maxFileSize: this.maxFileSize || this.constants.FILE_UPLOAD_DEFAULT_MAX_FILE_SIZE,
    });

    // Add withCredentials = false to avoid CORS issues
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

    // Trigger change detection on progress update to update UI
    this.uploader.onProgressItem = (item, progress) => {
      this.changeDetectorRef.detectChanges();
    };

    // Returns the file object once it's been uploaded
    this.uploader.onCompleteItem = (item: any, response: any, status: any) => {
      let file = JSON.parse(response);

      if (this.isMultiple) {
        // Add item to the FormArray
        this.addItem(file);

      } else {
        // Update the form with the new file
        this.form.get(this.field).setValue(file);
      }
    };

    this.uploader.onWhenAddingFileFailed = (item: any, filter: any, options: any) => {
      console.error('File error:', item, filter, options);

      switch (filter.name) {
        case 'mimeType':
          this.errorMessage = 'That file is the wrong type.';
          break;
        case 'fileSize':
          this.errorMessage = 'That file is too big.';
          break;
        default:
          this.errorMessage = 'That file cannot be uploaded.';
          break;
      }
    };

    // Add all of the files / images from the object
    if (this.object[this.field]) {
      if (this.object[this.field].constructor === Array) {
        this.object[this.field].forEach((item) => {
          this.addItem(item);
        });
      }
    }
  }

  addItem(item: any = {}) {
    const control = <FormArray>this.form.get(this.field);
    control.push(this.initItem(item));
  }

  initItem(item: any = {}) {
    const formGroup = this.formBuilder.group({});
    const fileKeys = Object.keys(item);

    fileKeys.forEach((key) => {
      formGroup.registerControl(key, new FormControl(item[key] || ''));
    });

    return formGroup;
  }

  removeItem(i: number) {
    const control = <FormArray>this.form.get(this.field);
    control.removeAt(i);
  }

  isImage(mimeType: string) {
    return this.constants.IMAGE_MIME_TYPES.indexOf(mimeType) >= 0;
  }

}
