import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FileUploadModule } from "ng2-file-upload";
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
    NgxSpinnerModule,
    NgxPaginationModule,
    FileUploadModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [],
  exports: [
    CommonModule,

    BsDropdownModule,
    TabsModule,
    NgxSpinnerModule,
    ToastrModule,

    NgxPaginationModule,
    FileUploadModule,

    ReactiveFormsModule,
    FormsModule,
  ]
})
export class SharedModule { }