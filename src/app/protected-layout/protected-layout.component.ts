import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-protected-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './protected-layout.component.html',
  styleUrls: ['./protected-layout.component.css']
})
export class ProtectedLayoutComponent implements OnInit, OnDestroy {
  username: string = '';
  private userProfileSubscription: Subscription | null = null;
  private fetchUserProfileSubscription: Subscription | null = null;;

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.userProfileSubscription = this.sessionService.getUserProfile().subscribe({
      next: (user) => {
        if (user && user.username) {
          this.username = user.username;
        } else {
          // If user or username is null or empty, fetch it from the backend
          this.fetchUserProfileSubscription = this.sessionService.fetchUserProfile().subscribe({
            next: (profile) => {
              this.username = profile.username;
            },
            error: (error) => {
              console.error('Failed to fetch user profile', error);
            }
          });
        }
      },
      error: (error) => {
        console.error('Error fetching user profile', error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userProfileSubscription) {
      this.userProfileSubscription.unsubscribe();
    }
    if (this.fetchUserProfileSubscription) {
      this.fetchUserProfileSubscription.unsubscribe();
    }
  }
}
