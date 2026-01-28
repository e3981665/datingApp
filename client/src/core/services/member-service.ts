import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { EditableMember, Member, Photo } from '../../types/member';
import { PaginatedResult } from '../../types/pagination';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  public editMode = signal(false);
  public member = signal<Member | null>(null);
  public loading = signal<boolean>(false);
  public cancelClicked = signal(false);

  getMembers() {
    return this.http.get<PaginatedResult<Member>>(this.baseUrl + 'members').pipe(
      map((result) => result.items ?? [])
    );
  }

  getMemberById(id: string) {
    return this.http.get<Member>(this.baseUrl + 'members/' + id).pipe(
      tap((member) => {
        this.member.set(member);
      })
    );
  }

  getMemberPhotos(id: string) {
    return this.http.get<Photo[]>(this.baseUrl + 'members/' + id + '/photos');
  }

  updateMember(member: EditableMember) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put<Member>(this.baseUrl + 'members', member, {
      headers,
    });
  }

  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Photo>(this.baseUrl + 'members/add-photo', formData);
  }

  setMainPhoto(photo: Photo) {
    return this.http.put<Photo>(
      this.baseUrl + 'members/set-main-photo/' + photo.id,
      {}
    );
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'members/delete-photo/' + photoId);
  }
}
