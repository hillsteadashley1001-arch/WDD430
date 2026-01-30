import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-item.html',
  styleUrls: ['./document-item.css']
})
export class DocumentItemComponent {
  @Input() document!: Document;  // ← Add this
}
