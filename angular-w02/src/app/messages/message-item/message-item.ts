import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-item.html',
  styleUrls: ['./message-item.css']
})
export class MessageItemComponent {
  @Input() message!: Message;  // ← Add this line
}
