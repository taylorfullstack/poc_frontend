import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import SockJS from 'sockjs-client/dist/sockjs';

export interface ChatMessage {
  chatId?: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client | null = null;
  private messagesSubject = new Subject<ChatMessage[]>();

  constructor() {}

  connect(username: string) {
    if (this.stompClient?.active) {
      this.disconnect();
    }

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(`${environment.wsUrl}`),
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    this.stompClient.onConnect = (_frame) => {
      this.getMessages(username)
    };

    this.stompClient.activate();
  }

  sendMessage(message: ChatMessage) {
    this.stompClient?.publish({
      destination: '/app/chat',
      body: JSON.stringify(message)
    });

    this.messagesSubject.next([message]);
  }

  getMessages(username: string) {
    this.stompClient?.subscribe(`/user/${username}/queue/messages`, (message) => {
      const chatMessage: ChatMessage = JSON.parse(message.body);
      this.messagesSubject.next([chatMessage]);
    });
  }

  getMessagesList(): Observable<ChatMessage[]> {
    return this.messagesSubject.asObservable();
  }

  disconnect() {
    if (this.stompClient?.active) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
  }
}
