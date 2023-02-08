import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MemberService } from 'src/app/services/member.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-change',
  templateUrl: './photo-change.component.html',
  styleUrls: ['./photo-change.component.css'],
})
export class PhotoChangeComponent implements OnInit {
  uploader:FileUploader;
  hasBaseDropZoneOver:boolean;
  baseUrl = environment.apiUrl;
  user: User;

  @Input() member: Member;
  constructor(private accountService: AccountService, private memberService: MemberService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }


  ngOnInit() {
    this.initializeUploader();
  }


  deletePhoto(photoId: number, userName: string) {
    this.memberService.deletePhoto(photoId, userName).subscribe(() => {
      this.member.appUserPhoto.url = "https://res.cloudinary.com/diamedrhv/image/upload/v1675783506/user_p3sxnc.png";
    });
  }

  initializeUploader() {
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

  fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

}
