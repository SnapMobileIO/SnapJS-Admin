import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-formcontrol-subdocument',
  templateUrl: './formcontrol-subdocument.component.html',
  styleUrls: ['./formcontrol-subdocument.component.scss'],
})
export class FormcontrolSubdocumentComponent {
  @Input() displayName: string;
  @Input() value: string;
}
