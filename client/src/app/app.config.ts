import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { dealReducer } from './state/deals/deal.reducer';
import { categoryReducer } from './state/categories/category.reducer';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(
            withInterceptors([
                jwtInterceptor,
                errorInterceptor,
                loadingInterceptor
            ])
        ),
        provideAnimations(),
        provideToastr({
            timeOut: 3000,
            positionClass: 'toast-bottom-right',
            preventDuplicates: true
        }),
        provideStore({ deals: dealReducer, categories: categoryReducer }),
        provideEffects()
    ]
};