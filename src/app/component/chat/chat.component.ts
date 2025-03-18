import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ChatService, Message } from '../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgForOf } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  imports: [
    FormsModule,
    DatePipe,
    NgForOf
  ],
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('messageInput') private messageInput!: ElementRef;
  @ViewChild('messageList') private messageList!: ElementRef;
  messages: Message[] = [];
  newMessageText: string = '';
  user: string | null = null;
  private shouldScroll = false;
  private isFirstLoad = true;

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    this.user = this.chatService.getUser();

    this.chatService.messages$.subscribe(msgs => {
      this.messages = msgs;
      if (!this.isFirstLoad) {
        this.shouldScroll = true; // Прокрутка при новых сообщениях
      }
      this.isFirstLoad = false; // Устанавливаем флаг после первого получения сообщений
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    // Добавление фокуса в поле ввода сообщений при входе
    setTimeout(() => {
      if (this.messageInput) {
        this.messageInput.nativeElement.focus();
      }
    }, 0);
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private scrollToBottom(): void {
    try {
      this.messageList.nativeElement.scrollTop =
        this.messageList.nativeElement.scrollHeight;
    } catch(err) {}
  }

  sendMessage() {
    if (!this.newMessageText.trim() || !this.user) return;
    const message: Message = {
      author: this.user,
      timestamp: Date.now(),
      text: this.newMessageText.trim()
    };
    this.chatService.addMessage(message);
    this.newMessageText = '';
    this.shouldScroll = true;
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }
}
