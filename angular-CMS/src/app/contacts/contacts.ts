import { Component, OnInit } from '@angular/core';
import { Contact } from './contact.model';
import { ContactService } from './contact.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContactListComponent } from './contact-list/contact-list';
import { ContactDetailComponent } from './contact-detail/contact-detail';

@Component({
  selector: 'cms-contacts',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ContactListComponent, 
    ContactDetailComponent
  ],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css'
})
export class ContactsComponent implements OnInit {
  selectedContact: Contact | null = null;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {

  }
}