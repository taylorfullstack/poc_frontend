import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../services/userlist.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  template: `
    <div class="flex flex-col gap-2">
      <h2>Select an online user to chat with or <button class="bg-brand-orange/90 hover:bg-brand-orange/50 text-black rounded-sm p-1" (click)="refreshUsers()">refresh online users</button></h2>

      <ul *ngIf="filteredUsers.length > 0; else noUsersTemplate">
        <li *ngFor="let user of filteredUsers">
          <a class="bg-brand-blue hover:bg-brand-blue/80 text-white p-1 rounded-sm" [routerLink]="['/chat', user.username]">
            <span title="{{ user.role }}" class="font-medium capitalize">{{ user.username }}</span>
          </a>
        </li>
      </ul>

      <ng-template #noUsersTemplate>
        <p class="bg-red-300" *ngIf="currentUserRole === 'CLIENT'">There are no available employees online to help you.<br> Please try again later or send a message via the contact form.</p>
        <p class="bg-red-300" *ngIf="currentUserRole === 'EMPLOYEE'">No clients online.</p>
      </ng-template>
    </div>
  `,
  imports: [CommonModule, RouterModule],
  styleUrls: []
})
export class UserListComponent implements OnInit, OnDestroy {
  @Input() currentUsername: string = '';
  @Input() currentUserRole: string = '';
  onlineUsers: any[] = [];
  filteredUsers: any[] = [];
  userlistSubscription: Subscription | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userlistSubscription = this.userService.getOnlineUsers().subscribe(users => {
      this.onlineUsers = users;
      this.filterUsers();
    });

    this.refreshUsers();
  }

  ngOnDestroy(): void {
    this.userlistSubscription?.unsubscribe();
  }

  refreshUsers(): void {
    this.userService.refreshOnlineUsers();
  }

  filterUsers(): void {
    this.filteredUsers = this.onlineUsers.filter(user => user.username !== this.currentUsername);

    if (this.currentUserRole === 'CLIENT') {
      this.filteredUsers = this.filteredUsers.filter(user => user.role === 'EMPLOYEE');
    } else if (this.currentUserRole === 'EMPLOYEE') {
      this.filteredUsers = this.filteredUsers.filter(user => user.role === 'CLIENT');
    }
  }
}
