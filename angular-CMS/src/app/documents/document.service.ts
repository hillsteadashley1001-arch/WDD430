import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Document } from './document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentListChangedEvent = new BehaviorSubject<Document[]>([]);
  documents: Document[] = [];
  maxDocumentId!: number;
  firebaseUrl = 'https://cms-codingqueen1001-default-rtdb.firebaseio.com/documents.json';

  constructor(private http: HttpClient) {
    // constructor is now empty to prevent early execution
  }

  fetchDocuments() {
    this.http.get<Document[]>(this.firebaseUrl).subscribe({
      next: (documents: any) => {
        console.log('1. Firebase Raw Response:', documents);

        // Standardize data: handle objects/arrays and filter nulls
        const fetchedDocs = documents ? Object.values(documents) : [];
        this.documents = (fetchedDocs as Document[]).filter(doc => !!doc && typeof doc === 'object');
        
        console.log('2. Processed Array:', this.documents);

        this.maxDocumentId = this.getMaxId();
        
        this.documents.sort((a, b) => {
          const nameA = a.name ? a.name.toLowerCase() : '';
          const nameB = b.name ? b.name.toLowerCase() : '';
          return nameA.localeCompare(nameB);
        });

        // Broadcast the data to the BehaviorSubject
        this.documentListChangedEvent.next([...this.documents]);
        console.log('3. Service Dispatched:', this.documents.length, 'documents');
      },
      error: (error: any) => console.error('Fetch Error:', error)
    });
  }

  getDocuments() {
    return [...this.documents];
  }

  storeDocuments() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    this.http.put(this.firebaseUrl, JSON.stringify(this.documents), { headers }).subscribe({
      next: () => {
        console.log('Data saved to Firebase. Broadcasting update...');
        this.documentListChangedEvent.next([...this.documents]);
      },
      error: (error: any) => console.error('Store Error:', error)
    });
  }

  getMaxId(): number {
    let maxId = 0;
    this.documents.forEach(doc => {
      if (doc && doc.id) {
        const currentId = parseInt(doc.id, 10);
        if (currentId > maxId) maxId = currentId;
      }
    });
    return maxId;
  }

  getDocument(id: string): Document | null {
    return this.documents.find((doc) => String(doc.id) === id) || null;
  }

  addDocument(newDocument: Document) {
    if (!newDocument) return;
    this.maxDocumentId++;
    newDocument.id = String(this.maxDocumentId);
    this.documents.push(newDocument);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) return;

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);
    if (pos < 0) return;

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.storeDocuments();
  }

  deleteDocument(document: Document) {
    if (!document) return;

    const pos = this.documents.findIndex(d => d.id === document.id);
    if (pos < 0) return;

    this.documents.splice(pos, 1);
    this.storeDocuments();
  }
}