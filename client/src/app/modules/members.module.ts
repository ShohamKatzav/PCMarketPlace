import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberListComponent } from '../members/member-list/member-list.component';
import { MemberDetailComponent } from '../members/member-detail/member-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from './shared.module';
import { MemberCardComponent } from '../members/member-card/member-card.component';
import { PhotoChangeComponent } from '../members/photo-change/photo-change.component';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';


const routes: Routes = [
  {path:'',component: MemberListComponent, pathMatch: 'full'},
  {path:':username',component: MemberDetailComponent}
]

@NgModule({
  declarations: [
    MemberListComponent,
    MemberDetailComponent,
    MemberCardComponent,
    PhotoChangeComponent,
    MemberEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports:[
    MemberListComponent,
    MemberDetailComponent,
    RouterModule,
    MemberCardComponent
  ]
})
export class MembersModule { }
