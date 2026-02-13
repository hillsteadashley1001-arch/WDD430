import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentsComponent } from './documents/documents';
import { MessageListComponent } from './messages/message-list/message-list';
import { ContactsComponent } from './contacts/contacts';
import { DocumentDetailComponent } from './documents/document-detail/document-detail';
import { DocumentEditComponent } from './documents/document-edit/document-edit';
import { ContactDetailComponent } from './contacts/contact-detail/contact-detail';
import { ContactEditComponent } from './contacts/contact-edit/contact-edit';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/documents', pathMatch: 'full' },
  
  {
    path: 'documents',
    component: DocumentsComponent,
    children: [
      { path: 'new', component: DocumentEditComponent },
      { path: ':id', component: DocumentDetailComponent },
      { path: ':id/edit', component: DocumentEditComponent }
    ]
  },

  { path: 'messages', component: MessageListComponent },

  {
    path: 'contacts',
    component: ContactsComponent,
    children: [
      { path: 'new', component: ContactEditComponent },
      { path: ':id', component: ContactDetailComponent },
      { path: ':id/edit', component: ContactEditComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }