import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../document.service';
import { Document } from '../document.model';
import { CommonModule } from '@angular/common';
import { DocumentItemComponent } from '../document-item/document-item';

@Component({
  selector: 'cms-document-list',
  standalone: true,
  imports: [CommonModule, DocumentItemComponent],
  templateUrl: './document-list.html',
  styleUrls: ['./document-list.css']
})

export class DocumentListComponent implements OnInit {
  documents: Document[] = [];

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    this.documents = this.documentService.getDocuments();
  }

  onSelectedDocument(document: Document) {  // ← ADD THIS
    this.documentService.documentSelectedEvent.emit(document);
  }
}
