import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
import { Photo } from 'src/app/models/Photo';
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

  @Input() product: Product;
  @Output() productChange = new EventEmitter<Product>();

  @ViewChild('photoInput') photoInputRef: ElementRef<HTMLInputElement>;

  constructor(private accountService: AccountService, private dealService: DealService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }


  ngOnInit() {
    this.initializeUploader();
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

  initializeUploader() {

    const headers = this.product ? [{ name: 'ProductId', value: this.product.id.toString() }] : [{ name: 'ProductId', value: "-1" }];

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
        console.log(this.product);
        const photo = JSON.parse(response);
        if (this.product)
          this.product.productPhoto = photo;
        else
        {
          const newProduct: Product = {
            id: -1,
            name: '', 
            category: '',
            price: 0,
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

      if (response) {
        // If the response is in JSON format, parse it to access the error message
        try {
          const errorData = JSON.parse(response);
          console.log('Error message:', errorData.message);
          // You can show the error message to the user or take appropriate action.
        } catch (error) {
          // If the response is not in JSON format, handle it based on the format.
          // For example, you can directly show the response as an error message.
          console.log('Error message:', response);
        }
      }

      // Clear the queue to remove the failed item from the upload queue.
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
