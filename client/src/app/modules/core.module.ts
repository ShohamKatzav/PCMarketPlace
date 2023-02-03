import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { FileUploadModule } from "ng2-file-upload";
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
  ],
  exports:[
    ToastrModule,
    BsDropdownModule
  ]
})
export class CoreModule { }
