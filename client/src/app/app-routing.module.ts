import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ProductListComponent } from './product/product-list/product-list.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: '',
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'members', // localhost:4200/members
        loadChildren: () => import('./modules/members.module').then(mod => mod.MembersModule)
      },
      {
        path: 'products', 
        loadChildren: () => import('./modules/products.module').then(mod => mod.ProductsModule)
      },
      {
        path: 'lists',
        component: ListsComponent,
      },
      {
        path: 'messages',
        component: MessagesComponent,
      },
    ]
  },
  {
    path: 'errors',
    component: TestErrorsComponent
  },

  {
    path: '**', // catch undefined address
    component: HomeComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
