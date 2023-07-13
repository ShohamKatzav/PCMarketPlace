import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
import { Deal } from 'src/app/models/deal';
import { Member } from 'src/app/models/member';
import { Product } from 'src/app/models/product';
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
  @Input() product: Product;

  constructor(private accountService: AccountService, private dealService: DealService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }


  ngOnInit() {

    this.loadMember();
    this.initializeUploader();
    this.uploader.onBeforeUploadItem = (fileItem: any) => {
      fileItem.formData.push({ ProductId: this.product.id });
    };
  }

  loadMember() {
    this.member = JSON.parse(localStorage.getItem("member"));
  }

  deletePhoto(productId: number) {
    this.dealService.deletePhoto(productId).subscribe(() => {
      this.product.productPhoto.url = "./assets/no-image.jpeg";
    });
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'deals/add-photo',
      headers: [{ name: 'ProductId', value: this.product?.id.toString() }],
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
        this.product.productPhoto = photo;
      }
    }
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

}
