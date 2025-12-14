import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DEAL_ROUTES } from './deals.routes';

@NgModule({
    imports: [RouterModule.forChild(DEAL_ROUTES)],
    exports: [RouterModule]
})
export class DealsModule { }
