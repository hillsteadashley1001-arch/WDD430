import { Component, Input } from '@angular/core';
import { Document } from '../document.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'cms-document-item',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './document-item.html'
})
export class DocumentItemComponent {
  @Input() document!: Document;
}