import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  contactChangedEvent = new Subject<Contact[]>();

  private contacts: Contact[] = [];

  constructor() {
    this.contacts = MOCKCONTACTS;
  }

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  getContact(id: string): Contact | null {
    return this.contacts.find((contact) => contact.id === id) || null;
  }

  addContact(newContact: Contact) {
    if (!newContact) return;

    // Generate a simple ID
    newContact.id = String(Math.floor(Math.random() * 10000));
    this.contacts.push(newContact);
    
    // Broadcast the updated list
    this.contactChangedEvent.next(this.contacts.slice());
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) return;

    const pos = this.contacts.findIndex(c => c.id === originalContact.id);
    if (pos < 0) return;

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    
    this.contactChangedEvent.next(this.contacts.slice());
  }

  deleteContact(contact: Contact) {
    if (!contact) return;

    const pos = this.contacts.findIndex(c => c.id === contact.id);
    if (pos < 0) return;

    this.contacts.splice(pos, 1);
    this.contactChangedEvent.next(this.contacts.slice());
  }
}