import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'; // 1. Import Subject
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  // 2. Use Subject for data changes (standard practice for Services)
  documentChangedEvent = new Subject<Document[]>();

  private documents: Document[] = [];

  constructor() {
    this.documents = MOCKDOCUMENTS;
  }

  getDocuments(): Document[] {
    return this.documents.slice();
  }

  getDocument(id: string): Document | null {
    // Ensuring ID comparison is robust
    return this.documents.find((doc) => String(doc.id) === id) || null;
  }

  addDocument(newDocument: Document) {
    if (!newDocument) return;
    
    // Assign a new ID (assuming strings based on your earlier setup)
    newDocument.id = String(Math.floor(Math.random() * 10000)); 
    
    this.documents.push(newDocument);
    // Push the updated list to all subscribers
    this.documentChangedEvent.next(this.documents.slice());
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) return;

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);
    if (pos < 0) return;
    
    // Keep the original ID
    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    
    // Push the updated list to all subscribers
    this.documentChangedEvent.next(this.documents.slice());
  }

  deleteDocument(document: Document) {
    if (!document) return;

    const pos = this.documents.findIndex(d => d.id === document.id);
    if (pos < 0) return;

    this.documents.splice(pos, 1);
    this.documentChangedEvent.next(this.documents.slice());
  }
}