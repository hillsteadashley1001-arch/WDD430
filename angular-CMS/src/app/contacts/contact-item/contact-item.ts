import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';  // ← Add this line
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-item',
  standalone: true,
  imports: [CommonModule],  // ← And this line
  templateUrl: './contact-item.html',
  styleUrls: ['./contact-item.css']
})
export class ContactItemComponent {
  @Input() contact!: Contact;
}
