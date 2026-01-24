import { Component, Output, EventEmitter } from '@angular/core';  // ← Add Output, EventEmitter
import { CommonModule } from '@angular/common';
import { DocumentItemComponent } from '../document-item/document-item';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  standalone: true,
  imports: [CommonModule, DocumentItemComponent],
  templateUrl: './document-list.html',
  styleUrls: ['./document-list.css']
})
export class DocumentListComponent {
  documents: Document[] = [
    new Document(1, 'Week 1 Notes', 'Angular intro', 'week1.pdf', []),
    new Document(2, 'W03 Assignment', 'Components spec', 'w03.pdf', []),
    new Document(3, 'Syllabus', 'Full course', 'syllabus.pdf', [])
  ];

  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  
  onSelected(document: Document): void {
    this.selectedDocumentEvent.emit(document);
  }
}
