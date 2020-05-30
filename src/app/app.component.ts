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
  windowSizeChangeTimeout: any = null

  alwaysShowSideNav: boolean = CommonHelper.isLargeScreen();

  constructor(private router: Router) {
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
