import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { ShareBottomSheetComponent } from './share-bottom-sheet/share-bottom-sheet.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {


  constructor(private bottomSheet: MatBottomSheet) {
  }

  openShareBottomSheet(): void {
    this.bottomSheet.open(ShareBottomSheetComponent);
  }
}
