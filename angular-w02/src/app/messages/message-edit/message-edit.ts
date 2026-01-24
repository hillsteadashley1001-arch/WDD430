import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-edit.html',
  styleUrls: ['./message-edit.css']
})
export class MessageEditComponent {
  @ViewChild('subject') subjectInput!: ElementRef<HTMLInputElement>;
  @ViewChild('msgText') msgTextInput!: ElementRef<HTMLInputElement>;
  
  @Output() addMessageEvent = new EventEmitter<Message>();
  
  currentSender = 'Ashley';  // ← Your name

  onSendMessage(): void {
    const subject = this.subjectInput.nativeElement.value;
    const msgText = this.msgTextInput.nativeElement.value;
    
    const newMessage = new Message(
      Date.now(),  // ID from timestamp
      subject,
      msgText,
      this.currentSender
    );
    
    this.addMessageEvent.emit(newMessage);
    this.onClear();
  }

  onClear(): void {
    this.subjectInput.nativeElement.value = '';
    this.msgTextInput.nativeElement.value = '';
  }
}
