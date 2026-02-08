import { Component, OnInit, OnDestroy } from '@angular/core';
import { Contact } from './contact.model';
import { ContactService } from './contact.service';
import { CommonModule } from '@angular/common';
import { ContactListComponent } from './contact-list/contact-list';
import { ContactDetailComponent } from './contact-detail/contact-detail';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-contacts',
  standalone: true,
  imports: [CommonModule, ContactListComponent, ContactDetailComponent],
  templateUrl: './contacts.html',
  styleUrls: ['./contacts.css']
})
export class ContactsComponent implements OnInit, OnDestroy {
  selectedContact: Contact | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.subscription.add(
      this.contactService.contactSelectedEvent.subscribe(
        (contact: Contact) => {
          this.selectedContact = contact;
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
