import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  inject,
  OnDestroy,
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
import { BrowserStorage } from './shared/utils/browser-storage';
import { CommonHelper } from './shared/utils/common-helper';
import { LANGUAGE_STORAGE_KEY, LanguageHelper } from './shared/utils/language-helper';

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
export class AppComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly destroyRef = inject(DestroyRef);

  private windowSizeChangeTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly languageStorageKey = `${environment.localStoragePrefix}${LANGUAGE_STORAGE_KEY}`;
  private readonly sideNavCollapsedStorageKey = `${environment.localStoragePrefix}side-nav-collapsed`;

  readonly alwaysShowSideNav = signal(CommonHelper.isLargeScreen());
  readonly sideNavCollapsed = signal(
    BrowserStorage.getLocalStorageItem(this.sideNavCollapsedStorageKey) === 'true',
  );
  readonly currentUrl = signal('/');
  readonly currentLanguageCode = signal(
    LanguageHelper.getAppLanguageCode(
      BrowserStorage.getLocalStorageItem(this.languageStorageKey),
      navigator.languages.length ? navigator.languages : [navigator.language],
    ),
  );
  readonly collapseNavigationLabel = $localize`:@@menu.collapse-navigation:Collapse navigation`;
  readonly expandNavigationLabel = $localize`:@@menu.expand-navigation:Expand navigation`;

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
    const bottomSheetRef = this.bottomSheet.open(SelectLanguageComponent, {
      data: { currentLanguageCode: this.currentLanguageCode() },
    });

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((newLanguageCode: string | undefined) => {
        const selectedLanguageCode = LanguageHelper.getSupportedLanguageCode(newLanguageCode);

        if (selectedLanguageCode && selectedLanguageCode !== this.currentLanguageCode()) {
          BrowserStorage.setLocalStorageItem(this.languageStorageKey, selectedLanguageCode);
          window.location.reload();
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

  toggleSideNav(): void {
    const collapsed = !this.sideNavCollapsed();

    this.sideNavCollapsed.set(collapsed);
    BrowserStorage.setLocalStorageItem(this.sideNavCollapsedStorageKey, String(collapsed));
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

    const languageCode = this.currentLanguageCode();
    this.meta.updateTag(<MetaDefinition>{
      property: 'og:locale',
      content: LanguageHelper.getOpenGraphLocale(languageCode),
    });
    this.meta.updateTag(<MetaDefinition>{
      property: 'og:locale:alternate',
      content: LanguageHelper.getAlternateOpenGraphLocale(languageCode),
    });
  }

  ngOnDestroy(): void {
    if (this.windowSizeChangeTimeout) {
      clearTimeout(this.windowSizeChangeTimeout);
    }
  }
}
