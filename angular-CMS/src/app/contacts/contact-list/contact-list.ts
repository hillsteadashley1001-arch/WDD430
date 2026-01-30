import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactItemComponent } from '../contact-item/contact-item';  // ADD THIS
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-list',
  standalone: true,
  imports: [CommonModule, ContactItemComponent],
  templateUrl: './contact-list.html',
  styleUrls: ['./contact-list.css']  // Note: styleUrl -> styleUrls (plural)
})
export class ContactListComponent {
  contacts: Contact[] = [
    new Contact(
      '1',
      'R. Kent Jackson',
      'jacksonk@byui.edu',
      '208-496-3771',
      'images/jacksonk.jpg',
      null
    ),
    new Contact(
      '2',
      'Rex Barzee',
      'barzeer@byui.edu',
      '208-496-3768',
      'images/barzeer.jpg',
      null
    )
  ];
  @Output() selectedContactEvent = new EventEmitter<Contact>();
  
  onSelected(contact: Contact): void {
    this.selectedContactEvent.emit(contact);
  }
}
