import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cms-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  @Output() featureSelected = new EventEmitter<string>();

  onSelected(feature: string) {
    this.featureSelected.emit(feature);
  }
}
