import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Message } from './message.model';

const MESSAGES_API_URL = 'http://localhost:3000/messages';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageListChangedEvent = new BehaviorSubject<Message[]>([]);
  messages: Message[] = [];
  maxMessageId!: number;

  constructor(private http: HttpClient) {}

  /** HTTP GET all messages from the Node server. */
  getMessages() {
    this.http.get<Message[]>(MESSAGES_API_URL).subscribe({
      next: (messages) => {
        this.messages = Array.isArray(messages)
          ? messages.filter((m) => !!m && typeof m === 'object')
          : [];
        this.sortAndSend();
      },
      error: (error: unknown) => console.error('Fetch messages error:', error)
    });
  }

  /** @deprecated Use getMessages(); kept for compatibility. */
  fetchMessages() {
    this.getMessages();
  }

  getMessagesSnapshot(): Message[] {
    return [...this.messages];
  }

  /** @deprecated Messages are persisted via API only. */
  storeMessages() {
    this.messageListChangedEvent.next([...this.messages]);
  }

  private sortMessages() {
    this.messages.sort((a, b) => {
      const idA = parseInt(String(a.id), 10);
      const idB = parseInt(String(b.id), 10);
      if (Number.isNaN(idA) || Number.isNaN(idB)) {
        return String(a.id).localeCompare(String(b.id));
      }
      return idA - idB;
    });
  }

  private sortAndSend() {
    this.maxMessageId = this.getMaxId();
    this.sortMessages();
    this.messageListChangedEvent.next([...this.messages]);
  }

  getMaxId(): number {
    let maxId = 0;
    this.messages.forEach((msg) => {
      if (msg?.id) {
        const currentId = parseInt(String(msg.id), 10);
        if (!Number.isNaN(currentId) && currentId > maxId) maxId = currentId;
      }
    });
    return maxId;
  }

  getMessage(id: string): Message | null {
    return this.messages.find((msg) => String(msg.id) === id) || null;
  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }

    message.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: string; createdMessage: Message }>(
        MESSAGES_API_URL,
        message,
        { headers }
      )
      .subscribe({
        next: (responseData) => {
          if (responseData.createdMessage) {
            this.messages.push(responseData.createdMessage);
            this.sortAndSend();
          }
        },
        error: (error: unknown) => console.error('Add message error:', error)
      });
  }

  updateMessage(originalMessage: Message, newMessage: Message) {
    if (!originalMessage || !newMessage) {
      return;
    }

    const pos = this.messages.findIndex((m) => m.id === originalMessage.id);

    if (pos < 0) {
      return;
    }

    newMessage.id = originalMessage.id;
    newMessage._id = originalMessage._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url =
      MESSAGES_API_URL + '/' + encodeURIComponent(String(originalMessage.id));

    this.http.put(url, newMessage, { headers }).subscribe({
      next: () => {
        this.messages[pos] = newMessage;
        this.sortAndSend();
      },
      error: (error: unknown) => console.error('Update message error:', error)
    });
  }

  deleteMessage(message: Message) {
    if (!message) {
      return;
    }

    const pos = this.messages.findIndex((m) => m.id === message.id);

    if (pos < 0) {
      return;
    }

    const url =
      MESSAGES_API_URL + '/' + encodeURIComponent(String(message.id));

    this.http.delete(url).subscribe({
      next: () => {
        this.messages.splice(pos, 1);
        this.sortAndSend();
      },
      error: (error: unknown) => console.error('Delete message error:', error)
    });
  }
}
