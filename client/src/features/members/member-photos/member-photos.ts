import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute } from '@angular/router';
import { Member, Photo } from '../../../types/member';
import { ImageUpload } from '../../../shared/image-upload/image-upload';
import { ToastService } from '../../../core/services/toast-service';
import { AccountService } from '../../../core/services/account-service';
import { User } from '../../../types/user';
import { StarButton } from '../../../shared/star-button/star-button';
import { DeleteButton } from '../../../shared/delete-button/delete-button';

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, StarButton, DeleteButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos implements OnInit {
  protected memberService = inject(MemberService);
  protected toastService = inject(ToastService);
  protected accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  protected photos = signal<Photo[]>([]);

  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if (memberId) {
      this.memberService.getMemberPhotos(memberId).subscribe((photos) => {
        this.photos.set(photos);
      });
    }
  }

  onUploadImage(file: File) {
    this.memberService.loading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: (photo) => {
        this.memberService.editMode.set(false);
        this.memberService.loading.set(false);
        this.photos.update((photos) => [...photos, photo]);
        if (!this.memberService.member()?.imageUrl) {
          this.setMainLocalPhoto(photo);
        }
        this.toastService.success('Photo uploaded successfully!');
      },
      error: (err) => {
        this.memberService.loading.set(false);
        console.error('Photo upload failed:', err);
      },
    });
  }

  setMainPhoto(photo: Photo) {
    this.memberService.loading.set(true);
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        this.setMainLocalPhoto(photo);
        this.toastService.success('Main photo set successfully!');
      },
      error: (err) => {
        console.error('Failed to set main photo:', err);
      },
      complete: () => {
        this.memberService.loading.set(false);
      },
    });
  }

  private setMainLocalPhoto(photo: Photo) {
    const currentUser = this.accountService.currentUser();
    if (currentUser) {
      currentUser.imageUrl = photo.url;
      this.accountService.setCurrentUser(currentUser as User);
      this.memberService.member.update(
        (member) =>
          ({
            ...member,
            imageUrl: photo.url,
          } as Member)
      );
    }
  }

  deletePhoto(photoId: number) {
    if (!confirm('Are you sure you want to delete this photo?')) {
      return;
    }
    this.memberService.loading.set(true);
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        this.photos.update((photos) => photos.filter((p) => p.id !== photoId));
        this.toastService.success('Photo deleted successfully!');
      },
      error: (err) => {
        console.error('Failed to delete photo:', err);
      },
      complete: () => {
        this.memberService.loading.set(false);
      },
    });
  }
}
