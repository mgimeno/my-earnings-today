import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, take } from 'rxjs';
import { environment } from '../environments/environment';
import { CommonHelper } from './shared/utils/common-helper';

@Component({
  selector: 'app-root',
  imports: [
    RouterLink,
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private router = inject(Router);
  private meta = inject(Meta);
  private title = inject(Title);
  private bottomSheet = inject(MatBottomSheet);
  private destroyRef = inject(DestroyRef);

  private windowSizeChangeTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly alwaysShowSideNav = signal(CommonHelper.isLargeScreen());
  readonly currentUrl = signal('/');
  readonly currentLanguageCode = signal(
    localStorage.getItem(`${environment.localStoragePrefix}language`) ?? 'en',
  );

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });

    this.addTitleAndMetaTags();
  }

  async openSelectLanguage(): Promise<void> {
    const { SelectLanguageComponent } =
      await import('./components/select-language/select-language.component');
    const bottomSheetRef = this.bottomSheet.open(SelectLanguageComponent);

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((newLanguageCode: string) => {
        if (newLanguageCode) {
          if (newLanguageCode !== this.currentLanguageCode()) {
            localStorage.setItem(`${environment.localStoragePrefix}language`, newLanguageCode);
            window.location.reload();
          }
        }
      });
  }

  @HostListener('window:resize')
  windowSizeChange(): void {
    if (this.windowSizeChangeTimeout) {
      clearTimeout(this.windowSizeChangeTimeout);
    }

    this.windowSizeChangeTimeout = setTimeout(() => {
      this.alwaysShowSideNav.set(CommonHelper.isLargeScreen());
    }, 100);
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }

  private addTitleAndMetaTags(): void {
    this.title.setTitle($localize`:@@index.title:My Earnings Today`);
    this.meta.updateTag(<MetaDefinition>{
      name: 'description',
      content: $localize`:@@index.meta_description:Calculate how much you have already earned today and compare with others`,
    });
    this.meta.updateTag(<MetaDefinition>{
      property: 'og:title',
      content: $localize`:@@index.title:My Earnings Today`,
    });
    this.meta.updateTag(<MetaDefinition>{
      property: 'og:description',
      content: $localize`:@@index.meta_og_description:Calculate how much you have already earned today and compare with others`,
    });

    const languageCode = localStorage.getItem(`${environment.localStoragePrefix}language`);
    this.meta.updateTag(<MetaDefinition>{
      property: 'og:locale',
      content: languageCode === 'en' ? 'en_GB' : 'es_ES',
    });
    this.meta.updateTag(<MetaDefinition>{
      property: 'og:locale:alternate',
      content: languageCode === 'en' ? 'es_ES' : 'en_GB',
    });
  }
}
