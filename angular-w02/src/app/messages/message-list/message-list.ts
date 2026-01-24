import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageItemComponent } from '../message-item/message-item';
import { MessageEditComponent } from '../message-edit/message-edit';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  standalone: true,
  imports: [
    CommonModule, 
    MessageItemComponent, 
    MessageEditComponent
  ],
  templateUrl: './message-list.html',
  styleUrls: ['./message-list.css']
})
export class MessageListComponent {
  messages: Message[] = [
    new Message(1, 'Welcome!', 'Welcome to WeLearn CMS!', 'System'),
    new Message(2, 'W03 Due', 'Components due Jan 20', 'Prof Jackson')
  ];

  onAddMessage(newMessage: Message): void {
    this.messages.unshift(newMessage);  // Add to top
  }

  trackById(index: number, message: Message): number {
    return message.id;
  }
}
