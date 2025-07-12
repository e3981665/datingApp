import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCredentials, User } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private accountService = inject(AccountService);
  cancelRegister = output<boolean>();
  protected credentials = {} as RegisterCredentials;

  register() {
    this.accountService.register(this.credentials).subscribe({
      next: (user: User) => {
        console.log('User registered successfully:', user);
        this.cancel();
      },
      error: (error) => {
        console.error('Registration failed:', error);
      },
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
