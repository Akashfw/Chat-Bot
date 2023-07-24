import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Message {
  content: string;
  sender: 'user' | 'bot';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-chat-app';
  newMessageContent = '';
  conversation: Message[] = [];

  constructor(private http: HttpClient) {
    const storedConversation = sessionStorage.getItem('conversation');
    if (storedConversation) {
      this.conversation = JSON.parse(storedConversation);
    }
  }

  sendMessage() {
    const userMessage: Message = {
      content: this.newMessageContent,
      sender: 'user'
    };
    this.conversation.push(userMessage);

    this.http.post('http://localhost:5000/chat', { content: this.newMessageContent })
      .subscribe((data: any) => {
        const botMessage: Message = {
          content: data.message,
          sender: 'bot'
        };
        this.conversation.push(botMessage);
        sessionStorage.setItem('conversation', JSON.stringify(this.conversation));
      });

    this.newMessageContent = '';
  }
}
