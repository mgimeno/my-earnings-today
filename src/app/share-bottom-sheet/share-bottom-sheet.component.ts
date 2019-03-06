import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {  MatBottomSheetRef } from '@angular/material';

declare var window: any;

@Component({
  templateUrl: './share-bottom-sheet.component.html',
  styleUrls: ['./share-bottom-sheet.component.scss']
})
export class ShareBottomSheetComponent implements OnInit {

  currentUrl: string;

  constructor(private bottomSheetRef: MatBottomSheetRef<ShareBottomSheetComponent>) {
    this.currentUrl = decodeURI(window.location.href);
  }

  ngOnInit() {
    window.__sharethis__.load('inline-share-buttons', {
      alignment: 'center',
      id: 'sharethis-buttons',
      enabled: true,
      font_size: 11,
      padding: 8,
      radius: 3,
      networks: ['facebook', 'messenger', 'twitter', 'whatsapp', 'email', 'sharethis'],
      size: 32,
      show_mobile_buttons: true,
      spacing: 7,
      url: window.location.href,
      title: "My Earnings Today", //todo get this from environment?
      image: "https://www.myearningstoday.com/assets/logo.png",
      description: "Calculate how much you have already earned today", //todo get this from environment?
    });
  }

  close(): void {
    this.bottomSheetRef.dismiss();
  }

}
