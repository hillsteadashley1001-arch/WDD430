import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; 
import { HeaderComponent } from './header/header';

@Component({
  selector: 'cms-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, 
    HeaderComponent
    ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {

}