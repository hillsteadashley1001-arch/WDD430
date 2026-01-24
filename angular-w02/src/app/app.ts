import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header';
import { DocumentsComponent } from './documents/documents';
import { MessageListComponent } from './messages/message-list/message-list';
import { ContactsComponent } from './contacts/contacts';

@Component({
  selector: 'cms-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    DocumentsComponent,
    MessageListComponent,
    ContactsComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  selectedFeature = 'documents';

  switchFeature(selectedFeature: string) {
    this.selectedFeature = selectedFeature;
  }
}
