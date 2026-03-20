import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Contact } from './contact.model';

const CONTACTS_API_URL = 'http://localhost:3000/contacts';

interface ContactsListResponse {
  message: string;
  contacts: Contact[];
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactListChangedEvent = new BehaviorSubject<Contact[]>([]);
  contacts: Contact[] = [];
  maxContactId!: number;

  constructor(private http: HttpClient) {}

  /** HTTP GET all contacts from the Node server (populated `group`). */
  getContacts() {
    this.http.get<ContactsListResponse | Contact[]>(CONTACTS_API_URL).subscribe({
      next: (data) => {
        let list: Contact[] = [];
        if (Array.isArray(data)) {
          list = data.filter((c) => !!c && typeof c === 'object');
        } else if (data && Array.isArray(data.contacts)) {
          list = data.contacts.filter((c) => !!c && typeof c === 'object');
        }
        this.contacts = list;
        this.sortAndSend();
      },
      error: (error: unknown) => console.error('Fetch contacts error:', error)
    });
  }

  /** @deprecated Use getContacts(); kept for compatibility. */
  fetchContacts() {
    this.getContacts();
  }

  getContactsSnapshot(): Contact[] {
    return [...this.contacts];
  }

  /** @deprecated Contacts are persisted via API only. */
  storeContacts() {
    this.contactListChangedEvent.next([...this.contacts]);
  }

  private sortContacts() {
    this.contacts.sort((a, b) => {
      const nameA = a.name ? a.name.toLowerCase() : '';
      const nameB = b.name ? b.name.toLowerCase() : '';
      return nameA.localeCompare(nameB);
    });
  }

  private sortAndSend() {
    this.maxContactId = this.getMaxId();
    this.sortContacts();
    this.contactListChangedEvent.next([...this.contacts]);
  }

  getMaxId(): number {
    let maxId = 0;
    this.contacts.forEach((contact) => {
      if (contact?.id) {
        const currentId = parseInt(String(contact.id), 10);
        if (!Number.isNaN(currentId) && currentId > maxId) maxId = currentId;
      }
    });
    return maxId;
  }

  getContact(id: string): Contact | null {
    return this.contacts.find((c) => String(c.id) === id) || null;
  }

  addContact(contact: Contact) {
    if (!contact) {
      return;
    }

    contact.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: string; contact: Contact }>(CONTACTS_API_URL, contact, {
        headers
      })
      .subscribe({
        next: (responseData) => {
          if (responseData.contact) {
            this.contacts.push(responseData.contact);
            this.sortAndSend();
          }
        },
        error: (error: unknown) => console.error('Add contact error:', error)
      });
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.findIndex((c) => c.id === originalContact.id);

    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    newContact._id = originalContact._id;

    if (newContact.group == null && originalContact.group != null) {
      newContact.group = originalContact.group;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url =
      CONTACTS_API_URL + '/' + encodeURIComponent(String(originalContact.id));

    this.http.put(url, newContact, { headers }).subscribe({
      next: () => {
        this.contacts[pos] = newContact;
        this.sortAndSend();
      },
      error: (error: unknown) => console.error('Update contact error:', error)
    });
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    const pos = this.contacts.findIndex((c) => c.id === contact.id);

    if (pos < 0) {
      return;
    }

    const url =
      CONTACTS_API_URL + '/' + encodeURIComponent(String(contact.id));

    this.http.delete(url).subscribe({
      next: () => {
        this.contacts.splice(pos, 1);
        this.sortAndSend();
      },
      error: (error: unknown) => console.error('Delete contact error:', error)
    });
  }
}
