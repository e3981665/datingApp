import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';
import { themes } from '../theme';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css'],
  standalone: true,
})
export class Nav implements OnInit {
  protected accountService = inject(AccountService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  protected credentials: { email?: string; password?: string } = {};
  protected selectedTheme = signal<string>(
    localStorage.getItem('theme') || 'light'
  );
  protected themes = themes;

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', this.selectedTheme());
  }

  handleSelectedTheme(theme: string) {
    this.selectedTheme.set(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    const elem = document.activeElement as HTMLDivElement;
    if (elem) elem.blur();
  }

  login() {
    this.accountService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
        this.credentials = {};
        this.toastService.success('Login successful!');
      },
      error: (response) => {
        this.toastService.error('Login failed. Error: ' + response.error);
      },
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
