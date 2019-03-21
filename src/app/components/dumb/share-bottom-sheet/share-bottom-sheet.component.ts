import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';
import { CommonHelper } from 'src/app/shared/helpers/common-helper';

declare var window: any;

@Component({
  templateUrl: './share-bottom-sheet.component.html',
  styleUrls: ['./share-bottom-sheet.component.scss']
})
export class ShareBottomSheetComponent implements OnInit {

  isLinkCopiedToClipboard: boolean = false;

  constructor(private bottomSheetRef: MatBottomSheetRef<ShareBottomSheetComponent>) {
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
      url: this.getCurrentUrl(),
      title: "My Earnings Today", //todo get this from environment?
      image: "https://www.myearningstoday.com/assets/logo.png",
      description: "Calculate how much you have already earned today", //todo get this from environment?
    });
  }

  copyLinkToClipboard(event: MouseEvent): void {
    event.preventDefault();
    CommonHelper.copyToClipboard(this.getCurrentUrl());
    this.isLinkCopiedToClipboard = true;
  }

  getCurrentUrl(): string {
    return decodeURI(window.location.href);
  }

  close(): void {
    this.bottomSheetRef.dismiss();
  }

}
