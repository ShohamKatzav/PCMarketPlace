import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { PreventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';
import { MEMBER_ROUTES } from './members/members.routes';
import { DEAL_ROUTES } from './deals/deals.routes';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
        pathMatch: 'full'
    },
    {
        path: '',
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always',
        children: [
            {
                path: 'members',
                canActivate: [AdminGuard],
                children: MEMBER_ROUTES
            },
            {
                path: 'member/edit',
                canDeactivate: [PreventUnsavedChangesGuard],
                loadComponent: () => import('./members/member-edit/member-edit.component').then(m => m.MemberEditComponent)
            },
            {
                path: 'deals',
                loadChildren: () => import('./deals/deals.module').then(m => m.DealsModule)
            },
            {
                path: 'categories',
                canActivate: [AdminGuard],
                loadComponent: () => import('./categories/categories-management/categories-management.component').then(m => m.CategoriesManagementComponent)
            }
        ]
    },
    {
        path: 'about-us',
        loadComponent: () => import('./about/about.component').then(m => m.AboutComponent)
    },
    {
        path: 'errors',
        loadComponent: () => import('./errors/test-errors/test-errors.component').then(m => m.TestErrorsComponent)
    },
    {
        path: 'not-found',
        loadComponent: () => import('./errors/not-found/not-found.component').then(m => m.NotFoundComponent)
    },
    {
        path: 'server-error',
        loadComponent: () => import('./errors/server-error/server-error.component').then(m => m.ServerErrorComponent)
    },
    {
        path: '**',
        redirectTo: 'not-found'
    }
];