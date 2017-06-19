import { Component, Input } from '@angular/core';
import { ConstantsService } from '../../constants.service';

@Component({
  selector: 'app-display-file',
  templateUrl: './display-file.component.html',
  styleUrls: ['./display-file.component.scss'],
})
export class DisplayFileComponent {
  @Input() files: any[];

  constructor(
    private constants: ConstantsService,
  ) {}

  isImage(mimeType: string) {
    return this.constants.IMAGE_MIME_TYPES.indexOf(mimeType) >= 0;
  }
}
