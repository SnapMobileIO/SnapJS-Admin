import { Component, OnDestroy, AfterViewInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-formcontrol-tinymce',
  templateUrl: './formcontrol-tinymce.component.html',
  styleUrls: ['./formcontrol-tinymce.component.scss'],
})
export class FormcontrolTinymceComponent implements AfterViewInit, OnDestroy {
  @Input() field: string;
  @Input() form: FormGroup;
  editor: any;

  ngAfterViewInit() {
    // tinyMCE.baseURL = '/assets/tinymce/';
    // tinymce.init({
    //   selector: `#tinymce-${this.field}`,
    //   menubar: false,
    //   plugins: ['link', 'paste', 'lists', 'advlist'],
    //   toolbar: 'styleselect | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | link image',
    //   setup: (editor) => {
    //     this.editor = editor;

    //     // Update the form as the user makes changes
    //     editor.on('keyup', () => {
    //       const content = editor.getContent();
    //       this.form.controls[this.field].patchValue(content);
    //     });

    //     // Need the blur for events that happen without 'keyup' (e.g. adding a link)
    //     editor.on('blur', () => {
    //       const content = editor.getContent();
    //       this.form.controls[this.field].patchValue(content);
    //     });
    //   },
    // });
  }

  ngOnDestroy() {
    // tinymce.remove(this.editor);
  }
}
