import { inject, Injectable } from '@angular/core';
import { IconService } from './icon.service';

@Injectable({
  providedIn: 'root',
})
export class AppInitService {
  private readonly iconService = inject(IconService);

  init(): void {
    this.iconService.registerIcons();
  }
}
