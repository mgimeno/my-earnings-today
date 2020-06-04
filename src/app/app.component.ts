import { Component, HostListener } from '@angular/core';
import { CommonHelper } from './shared/helpers/common-helper';
import { Router, NavigationEnd } from '@angular/router';
import { Meta, Title, MetaDefinition } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SelectLanguageComponent } from './components/dumb/select-language/select-language.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  window = window;
  windowSizeChangeTimeout: any = null
  alwaysShowSideNav: boolean = CommonHelper.isLargeScreen();
  currentUrl = '/';
  currentLanguageCode: string = localStorage.getItem(`${environment.localStoragePrefix}language`);

  constructor(
    private router: Router,
    private meta: Meta,
    private title: Title,
    private bottomSheet: MatBottomSheet) {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = this.router.routerState.snapshot.url;
      }
    });

    this.addTitleAndMetaTags();
  }

  doesUrlStartWith(url: string): boolean {
    return this.currentUrl.startsWith(url);
  }

  openSelectLanguage(): void {
    const bottomSheetRef = this.bottomSheet.open(SelectLanguageComponent);

    bottomSheetRef.afterDismissed().subscribe((newLanguageCode: string) => {

      if (newLanguageCode) {

        if (newLanguageCode !== this.currentLanguageCode) {
          localStorage.setItem(`${environment.localStoragePrefix}language`, newLanguageCode);
          window.location.reload();
        }

      }

    });
  }

  @HostListener('window:resize', ['$event'])
  windowSizeChange(event) {

    if (this.windowSizeChangeTimeout) {
      clearTimeout(this.windowSizeChangeTimeout);
    }

    this.windowSizeChangeTimeout = setTimeout(() => {
      this.alwaysShowSideNav = CommonHelper.isLargeScreen();
    }, 100);

  }

  private addTitleAndMetaTags(): void {

    this.title.setTitle($localize`:@@index.title:My Earnings Today`);
    this.meta.updateTag(<MetaDefinition>{ name: "description", content: $localize`:@@index.meta_description:Calculate how much you have already earned today and compare with others` });
    this.meta.updateTag(<MetaDefinition>{ property: "og:title", content: $localize`:@@index.title:My Earnings Today` });
    this.meta.updateTag(<MetaDefinition>{ property: "og:description", content: $localize`:@@index.meta_og_description:Calculate how much you have already earned today and compare with others` });

    const languageCode = localStorage.getItem(`${environment.localStoragePrefix}language`);
    this.meta.updateTag(<MetaDefinition>{ property: "og:locale", content: (languageCode === "en" ? "en_GB" : "es_ES") });
    this.meta.updateTag(<MetaDefinition>{ property: "og:locale:alternate", content: (languageCode === "en" ? "es_ES" : "en_GB") });

  }

}
