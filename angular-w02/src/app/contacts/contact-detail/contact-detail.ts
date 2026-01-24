import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-detail.html'
})
export class ContactDetailComponent {
  @Input() contact: Contact | null = null;
}
