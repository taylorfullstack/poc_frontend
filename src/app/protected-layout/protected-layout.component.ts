import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessionService } from '../services/session.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, of } from 'rxjs';
import { ChatComponent } from '../chat/chat.component';
import { UserListComponent } from '../chat/userlist.component';
import { switchMap, catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-protected-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ChatComponent, UserListComponent],
  templateUrl: './protected-layout.component.html',
  styleUrls: ['./protected-layout.component.css']
})
export class ProtectedLayoutComponent implements OnInit, OnDestroy {
  username: string = '';
  role: string = '';
  private userProfileSubscription: Subscription | null = null;

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.userProfileSubscription = this.sessionService.getUserProfile().pipe(
      switchMap(user => {
        if (user && user.username && user.role) {
          this.username = user.username;
          this.role = user.role;
          return of(null);
        } else {
          return this.sessionService.fetchUserProfile();
        }
      }),
      catchError(_error => {
        return of(null);
      }),
      finalize(() => {
        this.username = '';
        this.role = '';
      })
    ).subscribe(profile => {
      if (profile) {
        this.username = profile.username;
        this.role = profile.role;
      }
    });
  }

  ngOnDestroy(): void {
    this.userProfileSubscription?.unsubscribe();
  }
}
