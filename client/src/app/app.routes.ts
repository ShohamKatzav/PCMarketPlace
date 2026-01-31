import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { PreventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
        pathMatch: 'full'
    },
    {
        path: 'home',
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
                loadChildren: () => import('./members/members.routes').then(r => r.MEMBER_ROUTES)
            },
            {
                path: 'member/edit',
                canDeactivate: [PreventUnsavedChangesGuard],
                loadComponent: () => import('./members/member-edit/member-edit.component').then(m => m.MemberEditComponent)
            },
            {
                path: 'deals',
                loadChildren: () => import('./deals/deals.routes').then(r => r.DEAL_ROUTES)
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