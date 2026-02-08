import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Contact } from '../contact.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cms-contact-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-item.html',
  styleUrls: ['./contact-item.css']
})
export class ContactItemComponent {
  @Input() contact!: Contact;  
  
  @Output() selectedContactEvent = new EventEmitter<Contact>();

  onSelected(contact: Contact) { 
    this.selectedContactEvent.emit(contact);
  }
}
