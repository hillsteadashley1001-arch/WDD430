import { Component, Input } from '@angular/core';
import { Contact } from '../contact.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'cms-contact-item',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './contact-item.html',
  styleUrl: './contact-item.css'
})
export class ContactItemComponent {
  @Input() contact!: Contact;
}
