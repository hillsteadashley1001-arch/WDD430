import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cms-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']  // Fixed: styleUrl -> styleUrls (plural)
})
export class HeaderComponent {
}

