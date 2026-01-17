import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header';  // adjust path if needed
import { ContactsComponent } from './contacts/contacts';  // adjust path

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ContactsComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent { }
