import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RegisterCredentials, User } from '../../types/user';
import { tap } from 'rxjs';
import { Register } from '../../features/account/register/register';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);

  baseUrl = 'https://localhost:5001/api/';

  login(credentials: any) {
    return this.http
      .post<User>(this.baseUrl + 'account/login/', credentials)
      .pipe(
        tap((user) => {
          this.setCurrentUser(user);
        })
      );
  }

  setCurrentUser(user: User) {
    this.currentUser.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('user');
  }

  register(credentials: RegisterCredentials) {
    return this.http
      .post<User>(this.baseUrl + 'account/register/', credentials)
      .pipe(
        tap((user) => {
          this.setCurrentUser(user);
        })
      );
  }
}
