import { Component, HostListener } from '@angular/core';
import { CommonHelper } from './shared/helpers/common-helper';
import { Router, NavigationEnd } from '@angular/router';

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

  constructor(private router: Router) {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = this.router.routerState.snapshot.url;
        console.log(this.currentUrl);
      }
    });
  }

  doesUrlStartWith(url: string): boolean {
    return this.currentUrl.startsWith(url);
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

}
