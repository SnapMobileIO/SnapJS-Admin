import { Component, Input } from '@angular/core';
import { ConstantsService } from '../../constants.service';

@Component({
  selector: 'app-display-file',
  templateUrl: './display-file.component.html',
  styleUrls: ['./display-file.component.scss'],
})
export class DisplayFileComponent {
  @Input() field: string;
  @Input() files: any[];
  @Input() isImage: boolean;

  constructor(
    private constants: ConstantsService,
  ) {}
}
