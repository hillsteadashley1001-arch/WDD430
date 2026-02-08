import { Component, OnInit, OnDestroy } from '@angular/core';
import { DocumentService } from './document.service';
import { Document } from './document.model';
import { Subscription } from 'rxjs';
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
export class DocumentsComponent implements OnInit, OnDestroy {
  selectedDocument: Document | null = null;
  private subscription = new Subscription();

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    this.subscription.add(
      this.documentService.documentSelectedEvent.subscribe(
        (document: Document) => {
          this.selectedDocument = document;
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
