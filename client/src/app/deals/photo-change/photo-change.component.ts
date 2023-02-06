import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
import { Deal } from 'src/app/models/deal';
import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { DealService } from 'src/app/services/deal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-change',
  templateUrl: './photo-change.component.html',
  styleUrls: ['./photo-change.component.css']
})
export class PhotoChangeComponent implements OnInit {

  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  baseUrl = environment.apiUrl;
  user: User;

  member: Member;
  @Input() deal: Deal;
  constructor(private accountService: AccountService, private dealService: DealService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }


  ngOnInit() {

    this.loadMember();
    this.initializeUploader();
    this.uploader.onBeforeUploadItem = (fileItem: any) => {
      fileItem.formData.push({ DealId: this.deal.id });
    };
  }

  loadMember() {
    this.member = JSON.parse(localStorage.getItem("member"));
  }

  deletePhoto(dealId: number) {
    this.dealService.deletePhoto(dealId).subscribe(() => {
      this.deal.dealPhoto.url = "./assets/deal.jpg";
    });
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'deals/add-photo',
      headers: [{ name: 'DealId', value: this.deal.id.toString() }],
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
        this.deal.dealPhoto = photo;
      }
    }
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

}
