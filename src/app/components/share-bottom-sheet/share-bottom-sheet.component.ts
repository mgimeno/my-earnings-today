import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatButtonModule],
  templateUrl: './share-bottom-sheet.component.html',
  styleUrls: ['./share-bottom-sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareBottomSheetComponent implements OnDestroy {
  private bottomSheetRef = inject<MatBottomSheetRef<ShareBottomSheetComponent>>(MatBottomSheetRef);
  private copyStatusTimeoutId: ReturnType<typeof setTimeout> | null = null;

  readonly isLinkCopiedToClipboard = signal(false);
  readonly canShare = typeof navigator.share === 'function';
  readonly canCopyLink = typeof navigator.clipboard?.writeText === 'function';
  readonly currentUrl = window.location.href;

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
    if (!this.canCopyLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(this.currentUrl);
    } catch {
      this.isLinkCopiedToClipboard.set(false);
      return;
    }

    this.isLinkCopiedToClipboard.set(true);

    if (this.copyStatusTimeoutId) {
      clearTimeout(this.copyStatusTimeoutId);
    }

    this.copyStatusTimeoutId = window.setTimeout(() => {
      this.copyStatusTimeoutId = null;
      this.isLinkCopiedToClipboard.set(false);
    }, 1800);
  }

  close(): void {
    this.bottomSheetRef.dismiss();
  }

  ngOnDestroy(): void {
    if (this.copyStatusTimeoutId) {
      clearTimeout(this.copyStatusTimeoutId);
    }
  }
}
