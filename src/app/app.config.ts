import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { AppInitService } from './shared/services/app-init.service';
import { AppRoutePreloadingStrategy } from './shared/services/app-route-preloading.strategy';
import { ChunkLoadReloadService } from './shared/services/chunk-load-reload.service';

const createErrorHandler = (): ErrorHandler => {
  const delegate = new ErrorHandler();
  const chunkLoadReloadService = inject(ChunkLoadReloadService);

  return {
    handleError(error: unknown): void {
      chunkLoadReloadService.reloadIfChunkLoadError(error);
      delegate.handleError(error);
    },
  };
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    {
      provide: ErrorHandler,
      useFactory: createErrorHandler,
    },
    provideRouter(routes, withPreloading(AppRoutePreloadingStrategy), withComponentInputBinding()),
    importProvidersFrom(MatSnackBarModule),
    provideAppInitializer(() => inject(AppInitService).init()),
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { minWidth: 250, hasBackdrop: true },
    },
  ],
};
