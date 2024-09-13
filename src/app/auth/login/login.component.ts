import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SessionService } from '../../session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private sessionService: SessionService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.sessionService.fetchUserProfile().subscribe({
          next: (): void => {
            this.router.navigate(['/profile']);
          },
          error: (error: unknown): void => {
            console.error('Failed to fetch user profile', error);
          }
        });
      },
      error: (error) => {
        console.log(error.message);
        console.error('Login failed', error);
        this.errorMessage = error.message;
      }
    });
  }

  // constructor(private authService: AuthService, private router: Router) {}

  // login() {
  //   this.authService.login(this.email, this.password).subscribe({
  //     next: () => {
  //       this.router.navigate(['/profile']);
  //     },
  //     error: (error) => {
  //       console.log(error.message);
  //       console.error('Login failed', error);
  //       this.errorMessage = error.message;
  //     }
  //   });
  // }
}
