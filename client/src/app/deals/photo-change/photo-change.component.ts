import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { SharedModule } from 'src/app/modules/shared.module';
import { AccountService } from 'src/app/services/account.service';
import { DealService } from 'src/app/services/deal.service';
import { environment } from 'src/environments/environment';

@Component({
  standalone: true,
  selector: 'app-photo-change',
  templateUrl: './photo-change.component.html',
  styleUrls: ['./photo-change.component.css'],
  imports: [
    SharedModule,
    RouterModule
  ]
})
export class PhotoChangeComponent implements OnInit {

  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  baseUrl = environment.apiUrl;
  user: User;
  userSubscription: Subscription;

  @Input() product: Product;
  @Output() productChange = new EventEmitter<Product>();
  @Output() updateCacheAfterImageChange = new EventEmitter<void>();

  @ViewChild('photoInput') photoInputRef: ElementRef<HTMLInputElement>;

  constructor(private accountService: AccountService, private dealService: DealService) {
    this.userSubscription = this.accountService.currentUser$.subscribe(user => this.user = user);
  }


  async ngOnInit() {
    await this.initializeUploader();
    this.uploader.onBeforeUploadItem = (fileItem: any) => {
      const productId = this.product ? this.product.id : -1;
      fileItem.formData.push({ ProductId: productId });
    };
  }


  deletePhoto(productId: number) {
    this.updateCacheAfterImageChange.emit();
    this.uploader.clearQueue();
    this.resetFileInput();
    this.dealService.deletePhoto(productId).subscribe(() => {
      this.product.productPhoto.url = './assets/no-image.jpeg';
      this.updateCacheAfterImageChange.emit();
    });
  }
  deletePhotoProductDidntCreated() {
    this.uploader.clearQueue();
    this.resetFileInput();
    if (this.product?.productPhoto?.url)
      this.product.productPhoto.url = "./assets/no-image.jpeg";
  }

  async initializeUploader() {
    this.userSubscription = this.accountService.currentUser$.subscribe(user => this.user = user);
    const headers = this.product ? [{ name: 'ProductId', value: this.product?.id?.toString() }] : [{ name: 'ProductId', value: "-1" }];

    this.uploader = new FileUploader({
      url: this.baseUrl + 'deals/add-photo',
      headers,
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
        if (this.product?.id) {
          this.product.productPhoto = photo;
          this.updateCacheAfterImageChange.emit();
        }
        else {
          const newProductPhoto: any = {
            productPhoto: photo
          };
          // We just update the form and not the cache 'cause user didnt click on "update deal" and this product wasn't exist before.
          this.productChange.emit(newProductPhoto);
        }
      }
    }
    this.uploader.onErrorItem = (item, response, status, headers) => {
      console.log("Upload failed for item:", item);
      console.log("Response:", response);
      console.log("Status:", status);
      console.log("Headers:", headers);
      this.uploader.clearQueue();
    }
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  resetFileInput() {
    if (this.photoInputRef) {
      this.photoInputRef.nativeElement.value = '';
    }
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
