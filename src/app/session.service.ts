import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = 'http://localhost:8080/api/profile';
  private userSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  fetchUserProfile(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      tap(user => this.userSubject.next(user))
    );
  }

  getUserProfile(): Observable<any> {
    return this.userSubject.asObservable();
  }

  getUserName(): string {
    return this.userSubject.value?.username || '';
  }
}
