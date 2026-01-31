import { Component, inject, model, OnInit } from '@angular/core';
import { DecimalPipe, NgClass, NgStyle } from '@angular/common';
import { FileUploadModule, FileUploader } from 'ng2-file-upload';
import { Member } from 'src/app/models/member';
import { AccountService } from 'src/app/services/account.service';
import { MemberService } from 'src/app/services/member.service';
import { environment } from 'src/environments/environment';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-photo-change',
  standalone: true,
  imports: [NgClass, NgStyle, DecimalPipe, FileUploadModule],
  templateUrl: './photo-change.component.html',
  styleUrls: ['./photo-change.component.css']
})
export class PhotoChangeComponent implements OnInit {
  private accountService = inject(AccountService);
  private memberService = inject(MemberService);

  member = model.required<Member>();

  user = toSignal(this.accountService.currentUser$);

  uploader!: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;

  ngOnInit() {
    this.initializeUploader();
  }

  initializeUploader() {
    const currentUser = this.user();
    if (!currentUser) return;

    this.uploader = new FileUploader({
      url: `${this.baseUrl}users/add-photo`,
      headers: [{ name: 'UserName', value: this.member().userName }],
      authToken: `Bearer ${currentUser.token}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => (file.withCredentials = false);

    this.uploader.onSuccessItem = (item, response) => {
      if (response) {
        const photo = JSON.parse(response);
        this.member.update(m => ({ ...m, appUserPhoto: photo }));
      }
    };
  }

  deletePhoto(userName: string) {
    this.memberService.deletePhoto(userName).subscribe(() => {
      this.member.update(m => ({
        ...m,
        appUserPhoto: { ...m.appUserPhoto, url: "https://res.cloudinary.com/diamedrhv/image/upload/v1675783506/user_p3sxnc.png" }
      }));
    });
  }

  fileOverBase(e: boolean): void {
    this.hasBaseDropZoneOver = e;
  }
}