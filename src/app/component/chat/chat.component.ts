import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
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
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageList') private messageList!: ElementRef;
  messages: Message[] = [];
  newMessageText: string = '';
  user: string | null = null;
  private shouldScroll = false;

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
      this.shouldScroll = true; // Прокрутка при новых сообщениях в чате
      this.cdr.detectChanges();
    });
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
