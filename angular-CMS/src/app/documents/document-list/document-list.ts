import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { DocumentItemComponent } from '../document-item/document-item';

@Component({
  selector: 'cms-document-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DocumentItemComponent
  ],
  templateUrl: './document-list.html'
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: Document[] = [];
  private subscription!: Subscription;

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    this.documents = this.documentService.getDocuments();

    this.subscription = this.documentService.documentChangedEvent.subscribe(
      (documentsList: Document[] | undefined) => {
        this.documents = documentsList || [];
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}