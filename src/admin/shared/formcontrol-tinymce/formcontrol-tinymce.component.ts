import { Component, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConstantsService } from './../../../../../../client/app/providers/constants.service';

declare var tinyMCE: any;
declare var tinymce: any;

@Component({
  selector: 'app-formcontrol-tinymce',
  templateUrl: './formcontrol-tinymce.component.html',
  styleUrls: ['./formcontrol-tinymce.component.scss'],
})
export class FormcontrolTinymceComponent implements AfterViewInit, OnDestroy {
  @Input() field: string;
  @Input() displayName: string;
  @Input() form: FormGroup;
  editor: any;

  constructor(
    private constants: ConstantsService,
  ) { }

  ngAfterViewInit() {
    tinyMCE.baseURL = '/assets/tinymce/';
    let initOptions: object = {
      selector: `#tinymce-${this.field}`,
      menubar: false,
      plugins: ['link', 'paste', 'lists', 'advlist'],
      toolbar: 'styleselect | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | link image',
      setup: (editor) => {
        this.editor = editor;

        // Update the form as the user makes changes
        editor.on('keyup', () => {
          const content = editor.getContent();
          this.form.get(this.field).patchValue(content);
        });

        // Need the blur for events that happen without 'keyup' (e.g. adding a link)
        editor.on('blur', () => {
          const content = editor.getContent();
          this.form.get(this.field).patchValue(content);
        });
      },
    };
    // Merge in custom settings from Constants if present
    if (this.constants.ADMIN_WYSIWYG_OPTIONS) {
      initOptions = { ...initOptions, ...this.constants.ADMIN_WYSIWYG_OPTIONS };
    }
    tinymce.init(initOptions);
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }
}
