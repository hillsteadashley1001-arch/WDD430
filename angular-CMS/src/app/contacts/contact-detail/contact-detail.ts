import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './contact-detail.html',
  styleUrl: './contact-detail.css'
})
export class ContactDetailComponent implements OnInit {
  contact: Contact | null = null;
  id: string = '';

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.contact = this.contactService.getContact(this.id);
    });
  }

  onDelete() {
    if (this.contact) {
      this.contactService.deleteContact(this.contact);
      this.router.navigate(['/contacts']);
    }
  }
}