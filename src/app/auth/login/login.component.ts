import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SessionService } from '../../services/session.service';

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

  constructor(private authService: AuthService,
    private sessionService: SessionService,
    private router: Router) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.sessionService.fetchUserProfile().subscribe({
          next: (): void => {
            this.router.navigate(['/profile']);
          },
          error: (_error: unknown): void => {
          }
        });
      },
      error: (error) => {
        this.errorMessage = error.message;
      }
    });
  }
}
