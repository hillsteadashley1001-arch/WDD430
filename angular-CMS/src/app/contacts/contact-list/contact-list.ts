import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContactItemComponent } from '../contact-item/contact-item'; // Ensure path is correct
import { ContactsFilterPipe } from '../contacts-filter.pipe';

@Component({
  selector: 'cms-contact-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ContactItemComponent, ContactsFilterPipe],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css'
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  term: string = '';
  private subscription!: Subscription;

  constructor(
    private contactService: ContactService,
    private cdr: ChangeDetectorRef // Injected to handle async UI updates
  ) {}

  ngOnInit(): void {
    // 1. Setup the subscription FIRST to listen for incoming data
    this.subscription = this.contactService.contactListChangedEvent.subscribe(
      (contactList: Contact[]) => {
        console.log('Contacts received in component:', contactList.length);
        this.contacts = contactList;
        
        // 2. Force Angular to detect changes for the async data
        this.cdr.detectChanges();
      }
    );

    // 3. Trigger the fetch from the service SECOND
    this.contactService.fetchContacts();

    // 4. Initial sync check in case data is already in the service
    const initialContacts = this.contactService.getContactsSnapshot();
    if (initialContacts.length > 0) {
      this.contacts = initialContacts;
    }
  }

  search(value: string) {
    this.term = value;
  }

  ngOnDestroy(): void {
    // Clean up the subscription to prevent memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}