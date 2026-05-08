import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { appLoadStyles } from '../utils/load-to-dom.load-styles.util';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private readonly matIconRegistry = inject(MatIconRegistry);

  registerIcons(): void {
    this.registerMaterialIcons();
    this.matIconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }

  private registerMaterialIcons(): void {
    const url =
      'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@300&display=swap&icon_names=';

    // Check icon is not already part of the array, otherwise no icons will load.
    // No need to add icons sorted alphabetically -> we actively sort them.
    const icons = [
      'bar_chart',
      'calculate',
      'check_circle',
      'clear',
      'compare_arrows',
      'delete',
      'edit',
      'error',
      'help',
      'keyboard_double_arrow_left',
      'keyboard_double_arrow_right',
      'menu',
      'payments',
      'person_add',
      'list_alt',
      'share',
    ].sort();

    const style = {
      href: `${url}${icons.join(',')}`,
    };

    appLoadStyles([style]);
  }
}
