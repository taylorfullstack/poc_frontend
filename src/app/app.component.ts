import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Your Car Your Way';
  items = [
    { title: 'Explore the Docs', link: 'https://angular.dev' },
  ];
  isLoggedIn$: Observable<boolean>;

  constructor(public authService: AuthService, private router: Router) {
    this.isLoggedIn$ = this.authService.getAuthState();
  }

  ngOnInit() {}

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
