import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownDirective } from '../shared/dropdown';

@Component({
  selector: 'cms-header',
  standalone: true,
  imports: [CommonModule, DropdownDirective],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  @Output() featureSelected = new EventEmitter<string>();

  onSelected(feature: string) {
    this.featureSelected.emit(feature);
  }
}
