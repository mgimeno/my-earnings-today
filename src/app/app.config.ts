import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { AppInitService } from './shared/services/app-init.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    importProvidersFrom(MatSnackBarModule),
    provideAppInitializer(() => inject(AppInitService).init()),
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { minWidth: 250, hasBackdrop: true },
    },
  ],
};
