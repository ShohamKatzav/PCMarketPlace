import { Routes } from '@angular/router';
import { DealsListType } from '../models/dealsListType';

export const DEAL_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./deal-list/deal-list.component').then(m => m.DealListComponent),
        data: { listType: DealsListType.AvailableDeals }
    },
    {
        path: 'my-deals',
        loadComponent: () => import('./deal-list/deal-list.component').then(m => m.DealListComponent),
        data: { listType: DealsListType.CurrentUserDeals }
    },
    {
        path: 'new-deal',
        loadComponent: () => import('./create-deal/create-deal.component').then(m => m.CreateDealComponent)
    },
    {
        path: 'view-deal',
        loadComponent: () => import('./deal-details/deal-details.component').then(m => m.DealDetailsComponent)
    },
    {
        path: 'edit',
        loadComponent: () => import('./edit-deal/edit-deal.component').then(m => m.EditDealComponent)
    },
    {
        path: 'transaction',
        loadComponent: () => import('../transaction/transaction.component').then(m => m.TransactionComponent)
    }
];