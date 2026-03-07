import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageListChangedEvent = new BehaviorSubject<Message[]>([]);
  messages: Message[] = [];
  maxMessageId!: number;
  firebaseUrl = 'https://cms-codingqueen1001-default-rtdb.firebaseio.com/messages.json';

  constructor(private http: HttpClient) {}

  getMessages() {
    this.http.get<Message[]>(this.firebaseUrl).subscribe({
      next: (messages: Message[]) => {
        // If Firebase returns an array directly, use it; otherwise convert object to array
        this.messages = messages ? Object.values(messages) : [];
        
        // Clean the data to ensure no null entries
        this.messages = this.messages.filter(msg => !!msg && typeof msg === 'object');
        
        this.maxMessageId = this.getMaxId();
        
        // Notify subscribers
        this.messageListChangedEvent.next([...this.messages]);
      },
      error: (error: any) => {
        console.error('Error fetching messages:', error);
      }
    });
  }

  storeMessages() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    // We send the array directly
    this.http.put(this.firebaseUrl, JSON.stringify(this.messages), { headers }).subscribe({
      next: () => {
        this.messageListChangedEvent.next([...this.messages]);
      },
      error: (error: any) => {
        console.error('Error storing messages:', error);
      }
    });
  }

  getMaxId(): number {
    let maxId = 0;
    this.messages.forEach(msg => {
      const currentId = parseInt(msg.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }

  getMessage(id: string): Message | null {
    return this.messages.find((msg) => String(msg.id) === id) || null;
  }

  addMessage(newMessage: Message) {
    if (!newMessage) return;
    
    this.maxMessageId++;
    newMessage.id = String(this.maxMessageId);
    this.messages.push(newMessage);
    this.storeMessages();
  }
}