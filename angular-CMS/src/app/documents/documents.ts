import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { DocumentListComponent } from './document-list/document-list';
import { DocumentService } from './document.service';
import { Document } from './document.model';


@Component({
  selector: 'cms-documents',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    DocumentListComponent
  ],
  templateUrl: './documents.html'
})
export class DocumentsComponent implements OnInit, OnDestroy { 
  subscription!: Subscription;

  constructor(public documentService: DocumentService) {}

  ngOnInit() {
    this.documentService.getDocuments();

    this.subscription = this.documentService.documentListChangedEvent.subscribe(
      (documents: Document[]) => {

      }
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}