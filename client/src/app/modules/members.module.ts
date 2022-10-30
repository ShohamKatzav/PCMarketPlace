import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberListComponent } from '../members/member-list/member-list.component';
import { MemberDetailComponent } from '../members/member-detail/member-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from './shared.module';

const routes: Routes = [
  {path:'',component: MemberListComponent, pathMatch: 'full'},
  {path:':id',component: MemberDetailComponent}
]

@NgModule({
  declarations: [
    MemberListComponent,
    MemberDetailComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports:[
    MemberListComponent,
    MemberDetailComponent,
    RouterModule
  ]
})
export class MembersModule { }