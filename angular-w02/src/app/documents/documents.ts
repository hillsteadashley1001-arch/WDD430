import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentListComponent } from './document-list/document-list';
import { DocumentDetailComponent } from './document-detail/document-detail';

@Component({
  selector: 'cms-documents',
  standalone: true,
  imports: [CommonModule, DocumentListComponent, DocumentDetailComponent],
  templateUrl: './documents.html',
  styleUrls: ['./documents.css']
})
export class DocumentsComponent {
  selectedDocument: any = null;  // ← Add this line (Document type later)
}
