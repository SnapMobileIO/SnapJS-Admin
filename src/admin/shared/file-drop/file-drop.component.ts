import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef }   from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { ConstantsService } from '../../constants.service';

@Component({
  selector: 'app-file-drop',
  templateUrl: 'file-drop.component.html',
  styleUrls: ['./file-drop.component.scss'],
})
export class FileDropComponent implements OnInit {
  @Input() file: any = {};
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  errorMessage: string;
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean = false;
  dropDisabled: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private constants: ConstantsService,
  ) {}

  ngOnInit(): void {
    // Create uploader instance with options
    // Options are here...
    // https://github.com/valor-software/ng2-file-upload/blob/master/components/file-upload/file-uploader.class.ts
    // This will begin upload on drop
    // The queue limit is set to 1 so multiple files cannot be dragged and dropped
    this.uploader = new FileUploader({
      url: `${this.constants.API_BASE_URL}/aws/uploadToAws`,
      autoUpload: true,
      queueLimit: 1,
    });

    this.uploader.onAfterAddingFile = (file) => { 
      file.withCredentials = false; 
    };
        // Trigger change detection on progress update to update UI
        this.uploader.onProgressItem = (item, progress) => {
          this.changeDetectorRef.detectChanges();
        };
    
        // Returns the file object once it's been uploaded
        this.uploader.onCompleteItem = (item: any, response: any, status: any) => {
          this.file = JSON.parse(response);
          // emit the event - a file has been uploaded
          // set dropDisabled to true for UI purposes
          this.change.emit(this.file);
          this.dropDisabled = true;
        };
    
  }

  fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

}
