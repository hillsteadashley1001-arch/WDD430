import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { DocumentItemComponent } from '../document-item/document-item'; 

@Component({
  selector: 'cms-document-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DocumentItemComponent],
  templateUrl: './document-list.html'
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: Document[] = [];
  private subscription!: Subscription;

  constructor(
    public documentService: DocumentService,
    private cdr: ChangeDetectorRef // Injected to ensure UI updates on async data
  ) { }

  ngOnInit() {
    // 1. Setup Subscription FIRST
    // This prepares the component to "catch" the data when it arrives.
    this.subscription = this.documentService.documentListChangedEvent
      .subscribe((documentsList: Document[]) => {
        this.documents = documentsList;
        
        // Force Angular to refresh the view
        this.cdr.detectChanges(); 
      });

    // 2. Trigger the Fetch SECOND
    // Since we removed this from the Service constructor, we call it here.
    this.documentService.fetchDocuments();
    
    // 3. Optional: Sync immediate check
    const currentDocs = this.documentService.getDocumentsSnapshot();
    if (currentDocs.length > 0) {
      this.documents = currentDocs;
    }
  }

  ngOnDestroy() {
    // Prevent memory leaks when navigating away
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}