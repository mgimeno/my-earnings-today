import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatButtonModule],
  templateUrl: './share-bottom-sheet.component.html',
  styleUrls: ['./share-bottom-sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareBottomSheetComponent {
  private bottomSheetRef = inject<MatBottomSheetRef<ShareBottomSheetComponent>>(MatBottomSheetRef);

  readonly isLinkCopiedToClipboard = signal(false);
  readonly canShare = typeof navigator.share === 'function';
  readonly currentUrl = decodeURI(window.location.href);

  async share(): Promise<void> {
    if (!this.canShare) {
      await this.copyLink();
      return;
    }

    try {
      await navigator.share({
        title: $localize`:@@index.title:My Earnings Today`,
        text: $localize`:@@index.meta_description:Calculate how much you have already earned today and compare with others`,
        url: this.currentUrl,
      });
      this.close();
    } catch {
      // User cancelled. Keep sheet open.
    }
  }

  async copyLink(): Promise<void> {
    await navigator.clipboard.writeText(this.currentUrl);
    this.isLinkCopiedToClipboard.set(true);

    window.setTimeout(() => {
      this.isLinkCopiedToClipboard.set(false);
    }, 1800);
  }

  close(): void {
    this.bottomSheetRef.dismiss();
  }
}
