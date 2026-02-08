import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactItemComponent } from '../contact-item/contact-item';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';  

@Component({
  selector: 'cms-contact-list',
  standalone: true,
  imports: [CommonModule, ContactItemComponent],
  templateUrl: './contact-list.html',
  styleUrls: ['./contact-list.css']
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = []; 

  constructor(private contactService: ContactService) {} 

  ngOnInit() {
    this.contacts = this.contactService.getContacts();  
  }

  onSelected(contact: Contact): void {
    this.contactService.contactSelectedEvent.emit(contact);
  }
}
