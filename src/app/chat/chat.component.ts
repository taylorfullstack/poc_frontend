import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { WebSocketService, ChatMessage } from '../services/websocket.service';
import { SessionService } from '../services/session.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, of, filter } from 'rxjs';
import { switchMap, catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChatComponent implements OnInit, OnDestroy {

  messages: ChatMessage[] = [];
  newMessage: string = '';
  currentUserId: string = '';
  recipientId: string = '';
  chatId: string = '';
  private userProfileSubscription: Subscription | null = null;
  private routeSubscription: Subscription | null = null;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private webSocketService: WebSocketService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.userProfileSubscription = this.sessionService.getUserProfile().pipe(
      switchMap(user => {
        this.currentUserId = user?.username || '';

        if (!this.currentUserId) {
          return of(null);
        }

        return this.route.paramMap;
      }),
      switchMap(params => {
        if (!params) {
          return of(null);
        }

        const recipient = params.get('recipient');

        if (!recipient) {
          return of(null);
        }

        this.recipientId = recipient;
        this.webSocketService.connect(this.currentUserId);

        return this.webSocketService.getMessagesList();
      }),
      catchError(_error => {
        return of([]);
      }),
      finalize(() => {
        this.messages = [];
      })
    ).subscribe(messages => {
      if (messages) {
        this.messages = [...this.messages, ...messages];
      }
    });

    this.routeSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {

      this.resetChat();
    });
  }

  sendMessage(): void {
    const message: ChatMessage = {
      chatId: this.chatId,
      senderId: this.currentUserId,
      recipientId: this.recipientId,
      content: this.newMessage,
      timestamp: new Date()
    };

    this.webSocketService.sendMessage(message);
    this.newMessage = '';
  }

  ngOnDestroy() {
    this.userProfileSubscription?.unsubscribe();
    this.webSocketService.disconnect();
  }

  private resetChat(): void {
    this.messages = [];
  }
}

