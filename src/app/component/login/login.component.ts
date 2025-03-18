import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';

  constructor(private chatService: ChatService, private router: Router) {}

  login() {
    if (this.username.trim()) {
      this.chatService.setUser(this.username.trim());
      this.router.navigate(['/chat']);
    }
  }
}
