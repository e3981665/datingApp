import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css'],
  standalone: true,
})
export class Nav {
  protected accountService = inject(AccountService);
  protected credentials: { email?: string; password?: string } = {};
  protected isLoggedIn = signal(false);

  login() {
    console.log(this.credentials);

    this.accountService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.credentials = {};
      },
      error: (error) => {
        console.error('Login failed', error);
      },
    });
  }

  logout() {
    this.accountService.logout();
  }
}
