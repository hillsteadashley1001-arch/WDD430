import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() document!: Document;
  
  @Output() selectedDocumentEvent = new EventEmitter<Document>();  // ← ADD THIS

  onSelectedDocument(document: Document) {  // ← ADD THIS METHOD
    this.selectedDocumentEvent.emit(document);
  }
}
