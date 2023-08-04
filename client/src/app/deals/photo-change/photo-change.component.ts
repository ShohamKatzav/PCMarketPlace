import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
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
  user$: Observable<User>;

  @Input() product: Product;
  @Output() productChange = new EventEmitter<Product>();

  @ViewChild('photoInput') photoInputRef: ElementRef<HTMLInputElement>;

  constructor(private accountService: AccountService, private dealService: DealService) {
    this.user$ = this.accountService.currentUser$.pipe(first());
  }


  async ngOnInit() {
    await this.initializeUploader();
    this.uploader.onBeforeUploadItem = (fileItem: any) => {
      const productId = this.product ? this.product.id : -1;
      fileItem.formData.push({ ProductId: productId });
    };
  }

  
  deletePhoto(productId: number) {
    this.uploader.clearQueue();
    this.resetFileInput();
    this.dealService.deletePhoto(productId).subscribe(() => {
      this.product.productPhoto.url = "./assets/no-image.jpeg";
    });
  }
  deletePhotoProductDidntCreated() {
    this.uploader.clearQueue();
    this.resetFileInput();
    if (this.product?.productPhoto?.url) 
      this.product.productPhoto.url = "./assets/no-image.jpeg";
  }

  async initializeUploader() {
    const user = await this.user$.toPromise();
    const headers = this.product ? [{ name: 'ProductId', value: this.product.id.toString() }] : [{ name: 'ProductId', value: "-1" }];

    this.uploader = new FileUploader({
      url: this.baseUrl + 'deals/add-photo',
      headers,
      authToken: 'Bearer ' + user.token,
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
        if (this.product)
          this.product.productPhoto = photo;
        else
        {
          const newProduct: any = {
            productPhoto: photo
          };
          this.productChange.emit(newProduct);
        }
      }
    }
    this.uploader.onErrorItem= (item, response, status, headers) => {
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

  addNewPhoto(value: Product) {
    this.productChange.emit(value);
  }

  resetFileInput() {
    if (this.photoInputRef) {
      this.photoInputRef.nativeElement.value = '';
    }
  }

}
