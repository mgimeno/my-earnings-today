import { Component, HostListener } from '@angular/core';
import { CommonHelper } from './shared/helpers/common-helper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  window = window;
  windowSizeChangeTimeout: NodeJS.Timeout = null

  alwaysShowSideNav: boolean = CommonHelper.isLargeScreen();

  constructor(private router: Router) {
  }

  goTo(path: string): void {

    if (!this.alwaysShowSideNav) {
      (document.querySelector('#snav') as any).toggle();
    }

    this.router.navigate([path]);

    window.scrollTo(0, 0);
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
