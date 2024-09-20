import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/online-users`;
  private onlineUsersSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  onlineUsers$: Observable<any[]> = this.onlineUsersSubject.asObservable();

  constructor(private http: HttpClient) {}

  getOnlineUsers(): Observable<any[]> {
    return this.onlineUsers$;
  }

  refreshOnlineUsers(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(users => {
      this.onlineUsersSubject.next(users);
    });
  }
}
