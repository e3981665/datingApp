import {
  Component,
  effect,
  EnvironmentInjector,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  runInInjectionContext,
  signal,
  ViewChild,
} from '@angular/core';
import { EditableMember, Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css',
})
export class MemberProfile implements OnInit, OnDestroy {
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify(
    $event: BeforeUnloadEvent
  ) {
    if (this.editForm?.dirty) {
      $event.preventDefault();
    }
  }

  private accountService = inject(AccountService);
  protected memberService = inject(MemberService);
  private toastService = inject(ToastService);
  protected editableMember: EditableMember = {
    displayName: '',
    description: '',
    city: '',
    country: '',
  };
  protected originalMember: EditableMember | null = null;

  constructor() {
    effect(() => {
      if (this.memberService.cancelClicked()) {
        this.handleCancelRequest();
      }
    });
  }

  ngOnInit(): void {
    this.editableMember = {
      displayName: this.memberService.member()?.displayName || '',
      description: this.memberService.member()?.description || '',
      city: this.memberService.member()?.city || '',
      country: this.memberService.member()?.country || '',
    };
    this.originalMember = { ...this.editableMember };
  }

  ngOnDestroy(): void {
    this.memberService.editMode.set(false);
  }

  updateProfile() {
    if (!this.memberService.member()) return;

    const updatedMember = {
      ...this.memberService.member(),
      ...this.editableMember,
    };

    this.memberService.updateMember(this.editableMember).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if (
          currentUser &&
          updatedMember.displayName !== currentUser?.displayName
        ) {
          currentUser.displayName = updatedMember.displayName;
          this.accountService.setCurrentUser(currentUser);
        }
        this.toastService.success('Profile updated successfully!');
        this.memberService.editMode.set(false);
        this.memberService.member.set(updatedMember as Member);
        this.editForm?.resetForm(updatedMember);
      },
      error: (error) => {
        this.toastService.error('Failed to update profile: ' + error.message);
      },
    });
  }

  private handleCancelRequest(): void {
    this.memberService.cancelClicked.set(false); // reset signal

    if (this.isDirty()) {
      const confirmCancel = confirm(
        'You have unsaved changes. Are you sure you want to cancel?'
      );
      if (!confirmCancel) return;
    }

    this.resetForm();
    this.memberService.editMode.set(false);
  }

  private isDirty(): boolean {
    return this.editForm?.dirty ?? false;
  }

  private resetForm() {
    if (this.originalMember) {
      this.editableMember = { ...this.originalMember };
      this.editForm?.resetForm(this.originalMember);
    }
  }
}
