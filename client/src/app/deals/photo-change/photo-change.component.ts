import { Component, OnInit, output, viewChild, ElementRef, inject, model } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { Product } from 'src/app/models/product';
import { SharedModule } from 'src/app/modules/shared.module';
import { AccountService } from 'src/app/services/account.service';
import { DealService } from 'src/app/services/deal.service';
import { environment } from 'src/environments/environment';
import { toSignal } from '@angular/core/rxjs-interop';
import { DecimalPipe, NgClass, NgStyle } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-photo-change',
  templateUrl: './photo-change.component.html',
  styleUrls: ['./photo-change.component.css'],
  imports: [SharedModule, RouterModule, NgClass, NgStyle, DecimalPipe]
})
export class PhotoChangeComponent implements OnInit {
  private accountService = inject(AccountService);
  private dealService = inject(DealService);

  product = model<Product>();
  updateCacheAfterImageChange = output<void>();

  photoInputRef = viewChild<ElementRef<HTMLInputElement>>('photoInput');

  user = toSignal(this.accountService.currentUser$);

  uploader!: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;

  async ngOnInit() {
    this.initializeUploader();
  }

  initializeUploader() {
    const currentUser = this.user();
    if (!currentUser) return;

    const productId = this.product()?.id ?? -1;

    this.uploader = new FileUploader({
      url: `${this.baseUrl}deals/add-photo`,
      headers: [{ name: 'ProductId', value: productId.toString() }],
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
        const currentProduct = this.product();

        if (currentProduct?.id) {
          this.product.update(p => p ? ({ ...p, productPhoto: photo }) : p);
          this.updateCacheAfterImageChange.emit();
        } else {
          this.product.set({ productPhoto: photo } as Product);
        }
      }
    };
  }

  deletePhoto(productId: number) {
    this.updateCacheAfterImageChange.emit();
    this.uploader.clearQueue();
    this.resetFileInput();

    this.dealService.deletePhoto(productId).subscribe(() => {
      this.product.update(p => p ? ({ ...p, productPhoto: { ...p.productPhoto, url: './assets/no-image.jpeg' } }) : p);
      this.updateCacheAfterImageChange.emit();
    });
  }

  deletePhotoProductDidntCreated() {
    this.uploader.clearQueue();
    this.resetFileInput();
    this.product.update(p => p ? ({ ...p, productPhoto: { ...p.productPhoto, url: './assets/no-image.jpeg' } }) : p);
  }

  fileOverBase(e: boolean): void {
    this.hasBaseDropZoneOver = e;
  }

  resetFileInput() {
    const input = this.photoInputRef();
    if (input) input.nativeElement.value = '';
  }
}