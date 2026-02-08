import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageItemComponent } from '../message-item/message-item';
import { MessageEditComponent } from '../message-edit/message-edit';
import { MessageService } from '../message.service';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  standalone: true,
  imports: [CommonModule, MessageItemComponent, MessageEditComponent],
  templateUrl: './message-list.html',  
  styleUrls: ['./message-list.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [];

  constructor(private messageService: MessageService) {}

  onAddMessage(message: Message) {
    this.messages.push(message);
    console.log('Message added:', message);
  }

  ngOnInit() {
    this.messages = this.messageService.getMessages();
    this.messageService.messageChangedEvent.subscribe(
      (messages: Message[]) => {
        this.messages = messages;
      }
    );
  }

  trackById(index: number, message: Message): string {
    return message.id;  
  }
}
