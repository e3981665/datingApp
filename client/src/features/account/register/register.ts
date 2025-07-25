import { Component, inject, output, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RegisterCredentials, User } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';
import { TextInput } from '../../../shared/text-input/text-input';
import { matchPasswordValidator } from '../../../core/validators/password-match-validator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  protected accountService = inject(AccountService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  cancelRegister = output<boolean>();
  protected credentials = {} as RegisterCredentials;
  protected credentialsForm: FormGroup;
  protected profileForm: FormGroup;
  protected currentStep = signal<number>(1);
  protected validationErrors = signal<string[]>([]);

  constructor() {
    this.credentialsForm = this.fb.group({
      displayName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          matchPasswordValidator('password'),
        ],
      ],
    });

    this.profileForm = this.fb.group({
      gender: ['male', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
    });
  }

  nextStep() {
    if (this.credentialsForm.valid) {
      this.currentStep.update((prevStep) => prevStep + 1);
    }
  }

  prevStep() {
    this.currentStep.update((prevStep) => Math.max(prevStep - 1, 1));
  }

  getMaxDate(): string {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  }

  register() {
    if (this.credentialsForm.invalid || this.profileForm.invalid) {
      return;
    }

    if (this.credentialsForm.valid && this.profileForm.valid) {
      const formData = {
        ...this.credentialsForm.value,
        ...this.profileForm.value,
      };

      this.accountService.register(formData as RegisterCredentials).subscribe({
        next: (user: User) => {
          this.accountService.setCurrentUser(user);
          this.router.navigateByUrl('/members');
        },
        error: (err) => {
          console.error('Registration failed:', err);
          this.validationErrors.set(err);
        },
      });
    }
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
