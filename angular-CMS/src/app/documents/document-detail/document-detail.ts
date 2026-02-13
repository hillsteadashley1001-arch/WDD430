import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { WindRefService } from '../../win-ref.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'cms-document-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './document-detail.html',
  styleUrls: ['./document-detail.css']
})

export class DocumentDetailComponent implements OnInit {
  document!: Document;
  id!: string;
  nativeWindow: any;

  constructor(
    private documentService: DocumentService,
    private windowService: WindRefService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.nativeWindow = this.windowService.getNativeWindow();

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      const doc = this.documentService.getDocument(this.id);

      if (doc) {
        this.document = doc;
      }
    });
  }

  onView() {
    if (this.document && this.document.url) {
      this.nativeWindow.open(this.document.url);
    }
  }

  onDelete() {
    this.documentService.deleteDocument(this.document);
    this.router.navigate(['/documents']);
  }
}