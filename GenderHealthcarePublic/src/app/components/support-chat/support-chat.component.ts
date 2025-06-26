// support-chat.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-support-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './support-chat.component.html',
  styleUrls: ['./support-chat.component.css'],
})
export class SupportChatComponent {
  showChatPanel = false;
  message = '';
  isTyping = false;

  sendMessage() {
    if (this.message.trim()) {
      // Handle sending message here
      this.isTyping = true;

      // Simulate AI response
      setTimeout(() => {
        this.isTyping = false;
      }, 2000);

      this.message = '';
    }
  }

  toggleChat() {
    this.showChatPanel = !this.showChatPanel;
  }
}
