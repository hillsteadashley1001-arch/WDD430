import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-detail.html',
  styleUrls: ['./contact-detail.css']  // Fixed: styleUrl -> styleUrls (plural)
})
export class ContactDetailComponent {
  contact: Contact | null = null;  // Will be set later via component input
}
