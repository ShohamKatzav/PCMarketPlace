import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

// Global handlers to recover from dynamic chunk load failures in dev (HMR / SSL cert prompts can block script loads)
window.addEventListener('error', (event: ErrorEvent) => {
  const err = (event && (event as any).error) || event.error;
  if (err && err.name === 'ChunkLoadError') {
    console.warn('ChunkLoadError detected, reloading page to recover.');
    window.location.reload();
  }
});

window.addEventListener('unhandledrejection', (ev: PromiseRejectionEvent) => {
  const reason = ev && (ev as any).reason;
  if (reason && reason.name === 'ChunkLoadError') {
    console.warn('Unhandled ChunkLoadError promise rejection, reloading.');
    window.location.reload();
  }
});