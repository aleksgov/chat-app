import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Message {
  author: string;
  timestamp: number;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesKey = 'chat_messages';
  private userKey = 'chat_user';
  private messagesSubject = new BehaviorSubject<Message[]>(this.loadMessages());
  public messages$ = this.messagesSubject.asObservable();

  // Инициализация BroadcastChannel для синхронизации между вкладками
  private broadcast = new BroadcastChannel('chat_channel');

  constructor() {
    // При получении сообщения из другой вкладки добавляем его локально
    this.broadcast.onmessage = (event) => {
      if (event.data && event.data.type === 'NEW_MESSAGE') {
        this.addMessage(event.data.payload, false);
      }
    };
  }

  private loadMessages(): Message[] {
    const stored = localStorage.getItem(this.messagesKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveMessages(messages: Message[]) {
    localStorage.setItem(this.messagesKey, JSON.stringify(messages));
  }

  addMessage(message: Message, broadcast: boolean = true) {
    const currentMessages = this.messagesSubject.getValue();
    const updatedMessages = [...currentMessages, message];
    this.messagesSubject.next(updatedMessages);
    this.saveMessages(updatedMessages);

    if (broadcast) {
      this.broadcast.postMessage({ type: 'NEW_MESSAGE', payload: message });
    }
  }

  getUser(): string | null {
    return localStorage.getItem(this.userKey);
  }

  setUser(name: string) {
    localStorage.setItem(this.userKey, name);
  }
}
