import { Component, Input, OnInit, ChangeDetectorRef }   from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { File } from './file';
import { ConstantsService } from '../../constants.service';

@Component({
  selector: 'app-formcontrol-file-upload',
  templateUrl: 'formcontrol-file-upload.component.html',
  styleUrls: ['./formcontrol-file-upload.component.scss'],
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
          const allowedMimeTypes = this.allowedMimeType.join(', ');
          this.errorMessage = `That file is the wrong type. Accepted file types are ${allowedMimeTypes}`;
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
