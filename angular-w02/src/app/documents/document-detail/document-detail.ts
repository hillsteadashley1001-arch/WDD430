import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-detail.html',
  styleUrls: ['./document-detail.css']
})
export class DocumentDetailComponent {
  @Input() document: Document | null = null;  // ← 'document', not 'selectedDocument'
}
