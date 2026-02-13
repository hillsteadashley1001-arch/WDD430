import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DocumentListComponent } from './document-list/document-list';

@Component({
  selector: 'cms-documents',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    DocumentListComponent
  ],
  templateUrl: './documents.html'
})
export class DocumentsComponent { }