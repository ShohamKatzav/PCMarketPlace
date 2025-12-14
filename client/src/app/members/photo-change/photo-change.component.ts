import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MemberService } from 'src/app/services/member.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-change',
  templateUrl: './photo-change.component.html',
  styleUrls: ['./photo-change.component.css'],
  imports: [
    CommonModule,
    FileUploadModule
  ]
})
export class PhotoChangeComponent implements OnInit {
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  baseUrl = environment.apiUrl;
  user: User;
  userSubscription: Subscription;

  @Input() member: Member;
  constructor(private accountService: AccountService, private memberService: MemberService) {
    this.userSubscription = this.accountService.currentUser$.subscribe(user => this.user = user);
  }


  ngOnInit() {
    if (this.member)
      this.initializeUploader();
  }


  deletePhoto(userName: string) {
    this.memberService.deletePhoto(userName).subscribe(() => {
      this.member.appUserPhoto.url = "https://res.cloudinary.com/diamedrhv/image/upload/v1675783506/user_p3sxnc.png";
    });
  }

  async initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      headers: [{ name: 'UserName', value: this.member.userName }],
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });


    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        this.member.appUserPhoto = photo;
      }
    }
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
