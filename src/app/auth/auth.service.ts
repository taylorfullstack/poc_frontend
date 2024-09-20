import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = environment.apiUrl + '/login';
  private authState = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.loginUrl, { email, password }, { headers })
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('authToken', response.token);
            this.authState.next(true);
          }
        }),
        catchError(error => {
          return throwError(() => new Error(error.message || 'Server error'));
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/logout', {}).pipe(
        tap(response => {
            if (response.success) {
                localStorage.removeItem('authToken');
                this.authState.next(false);
            }
        }),
        catchError(error => {
            return throwError(() => new Error(error.message || 'Server error'));
        })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }
}
