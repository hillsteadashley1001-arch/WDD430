import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactListChangedEvent = new BehaviorSubject<Contact[]>([]);
  contacts: Contact[] = [];
  maxContactId!: number;
  // Make sure this URL matches your Firebase structure
  firebaseUrl = 'https://cms-codingqueen1001-default-rtdb.firebaseio.com/contacts.json';

  constructor(private http: HttpClient) {}

  fetchContacts() {
    this.http.get<Contact[]>(this.firebaseUrl).subscribe({
      next: (contacts: any) => {
        // Handle null and convert Firebase object to array
        const fetchedContacts = contacts ? Object.values(contacts) : [];
        // Filter out nulls and ensure items are objects
        this.contacts = (fetchedContacts as Contact[]).filter(c => !!c && typeof c === 'object');
        
        this.maxContactId = this.getMaxId();
        
        // Sort alphabetically by name
        this.contacts.sort((a, b) => {
          const nameA = a.name ? a.name.toLowerCase() : '';
          const nameB = b.name ? b.name.toLowerCase() : '';
          return nameA.localeCompare(nameB);
        });

        this.contactListChangedEvent.next([...this.contacts]);
      },
      error: (error: any) => console.error('Fetch Contacts Error:', error)
    });
  }

  storeContacts() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    // Save the entire array back to Firebase
    this.http.put(this.firebaseUrl, JSON.stringify(this.contacts), { headers }).subscribe({
      next: () => {
        this.contactListChangedEvent.next([...this.contacts]);
      },
      error: (error: any) => console.error('Store Contacts Error:', error)
    });
  }

  getContacts() {
    return [...this.contacts];
  }

  getContact(id: string): Contact | null {
    return this.contacts.find((c) => String(c.id) === id) || null;
  }

  getMaxId(): number {
    let maxId = 0;
    this.contacts.forEach(contact => {
      const currentId = parseInt(contact.id, 10);
      if (currentId > maxId) maxId = currentId;
    });
    return maxId;
  }

  addContact(newContact: Contact) {
    if (!newContact) return;
    this.maxContactId++;
    newContact.id = String(this.maxContactId);
    this.contacts.push(newContact);
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) return;

    const pos = this.contacts.findIndex(c => c.id === originalContact.id);
    if (pos < 0) return;

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.storeContacts();
  }

  deleteContact(contact: Contact) {
    if (!contact) return;

    const pos = this.contacts.findIndex(c => c.id === contact.id);
    if (pos < 0) return;

    this.contacts.splice(pos, 1);
    this.storeContacts();
  }
}