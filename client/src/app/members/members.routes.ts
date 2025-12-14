import { Routes } from '@angular/router';

export const MEMBER_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./member-list/member-list.component').then(m => m.MemberListComponent)
    },
    {
        path: ':username',
        loadComponent: () => import('./member-detail/member-detail.component').then(m => m.MemberDetailComponent)
    }
];