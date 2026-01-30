import { Component } from '@angular/core';
import { Contact } from './contact.model';  // adjust path
import { CommonModule } from '@angular/common';
import { ContactListComponent } from './contact-list/contact-list';
import { ContactDetailComponent } from './contact-detail/contact-detail';

@Component({
  selector: 'cms-contacts',
  standalone: true,
  imports: [CommonModule, ContactListComponent, ContactDetailComponent],
  templateUrl: './contacts.html',
  styleUrls: ['./contacts.css']
})
export class ContactsComponent {
  selectedContact: Contact | null = null;
}
