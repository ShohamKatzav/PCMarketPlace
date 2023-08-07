import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { CategoriesManagementComponent } from './categories/categories-management/categories-management.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { PreventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';
import { HomeComponent } from './home/home.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { CreateDealComponent } from './deals/create-deal/create-deal.component';
import { EditDealComponent } from './deals/edit-deal/edit-deal.component';

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
        canActivate: [AdminGuard],
        loadChildren: () => import('./modules/members.module').then(mod => mod.MembersModule),
      },
      {
        path: 'member/edit',
        component: MemberEditComponent,
        canDeactivate: [PreventUnsavedChangesGuard]
      },
      {
        path: 'deals/new-deal',
        component: CreateDealComponent,
        canDeactivate: [PreventUnsavedChangesGuard],
        pathMatch: 'full'
      },
      {
        path: 'deals',
        loadChildren: () => import('./modules/deals.module').then(mod => mod.DealsModule)
      },
      { 
        path: 'deals/edit',
        component: EditDealComponent,
        canDeactivate: [PreventUnsavedChangesGuard]
      },
      {
        path: 'categories',
        component: CategoriesManagementComponent,
        canActivate: [AdminGuard],
      }
    ]
  },
  {
    path: 'about-us',
    component: AboutComponent,
  },
  {
    path: 'errors',
    component: TestErrorsComponent
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
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
