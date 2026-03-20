import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Document } from './document.model';

/** Node/Express documents API (maps to server/routes/documents.js router.get('/')). */
const DOCUMENTS_API_URL = 'http://localhost:3000/documents';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentListChangedEvent = new BehaviorSubject<Document[]>([]);
  /** True while GET /documents is in flight; false after success or error. */
  documentsLoading = new BehaviorSubject<boolean>(true);
  documents: Document[] = [];
  maxDocumentId!: number;

  constructor(private http: HttpClient) {}

  /**
   * HTTP GET all documents from the Node server (MongoDB `documents` collection).
   */
  getDocuments() {
    this.documentsLoading.next(true);
    this.http
      .get<Document[]>(DOCUMENTS_API_URL)
      .pipe(finalize(() => this.documentsLoading.next(false)))
      .subscribe({
        next: (documents) => {
          this.documents = Array.isArray(documents)
            ? documents.filter((doc) => !!doc && typeof doc === 'object')
            : [];
          this.sortAndSend();
        },
        error: (error: unknown) => console.error('Fetch documents error:', error)
      });
  }

  /** @deprecated Use getDocuments(); kept for compatibility. */
  fetchDocuments() {
    this.getDocuments();
  }

  /** Synchronous copy of the last loaded documents (after getDocuments() completes). */
  getDocumentsSnapshot(): Document[] {
    return [...this.documents];
  }

  /** @deprecated Use POST/PUT/DELETE via API; kept for compatibility if referenced elsewhere. */
  storeDocuments() {
    this.documentListChangedEvent.next([...this.documents]);
  }

  private sortDocuments() {
    this.documents.sort((a, b) => {
      const nameA = a.name ? a.name.toLowerCase() : '';
      const nameB = b.name ? b.name.toLowerCase() : '';
      return nameA.localeCompare(nameB);
    });
  }

  private sortAndSend() {
    this.maxDocumentId = this.getMaxId();
    this.sortDocuments();
    this.documentListChangedEvent.next([...this.documents]);
  }

  getMaxId(): number {
    let maxId = 0;
    this.documents.forEach((doc) => {
      if (doc?.id) {
        const currentId = parseInt(String(doc.id), 10);
        if (!Number.isNaN(currentId) && currentId > maxId) maxId = currentId;
      }
    });
    return maxId;
  }

  getDocument(id: string): Document | null {
    return this.documents.find((doc) => String(doc.id) === id) || null;
  }

  addDocument(document: Document) {
    if (!document) {
      return;
    }

    // make sure id of the new Document is empty
    document.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http
      .post<{ message: string; document: Document }>(
        DOCUMENTS_API_URL,
        document,
        { headers }
      )
      .subscribe({
        next: (responseData) => {
          if (responseData.document) {
            this.documents.push(responseData.document);
            this.sortAndSend();
          }
        },
        error: (error: unknown) => console.error('Add document error:', error)
      });
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex((d) => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;
    newDocument._id = originalDocument._id;

    // keep nested children when the edit form does not send them
    if (newDocument.children == null && originalDocument.children != null) {
      newDocument.children = originalDocument.children;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const url =
      DOCUMENTS_API_URL + '/' + encodeURIComponent(String(originalDocument.id));

    // update database
    this.http.put(url, newDocument, { headers }).subscribe({
      next: () => {
        this.documents[pos] = newDocument;
        this.sortAndSend();
      },
      error: (error: unknown) => console.error('Update document error:', error)
    });
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.findIndex((d) => d.id === document.id);

    if (pos < 0) {
      return;
    }

    // delete from database — maps to router.delete('/:id') in documents.js
    const url =
      DOCUMENTS_API_URL + '/' + encodeURIComponent(String(document.id));

    this.http.delete(url).subscribe({
      next: () => {
        this.documents.splice(pos, 1);
        this.sortAndSend();
      },
      error: (error: unknown) => console.error('Delete document error:', error)
    });
  }
}
