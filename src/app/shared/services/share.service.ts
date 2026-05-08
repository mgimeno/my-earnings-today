import { inject, Injectable } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  private readonly notificationService = inject(NotificationService);
  private readonly linkCopiedMessage = $localize`:@@share.link-copied:Link copied`;
  private readonly copyFailedMessage = $localize`:@@share.copy-failed:Could not copy link`;

  async shareCurrentUrl(): Promise<void> {
    const currentUrl = window.location.href;

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ url: currentUrl });
        return;
      } catch (error) {
        if (this.isUserCancelledShare(error)) {
          return;
        }
      }
    }

    await this.copyUrl(currentUrl);
  }

  private async copyUrl(url: string): Promise<void> {
    const copied = await this.copyText(url);

    if (copied) {
      this.notificationService.success(this.linkCopiedMessage);
      return;
    }

    this.notificationService.error(this.copyFailedMessage);
  }

  private async copyText(text: string): Promise<boolean> {
    if (typeof navigator.clipboard?.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // Fall back to the older browser copy path below.
      }
    }

    return this.copyTextWithFallback(text);
  }

  private copyTextWithFallback(text: string): boolean {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';

    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);

    try {
      return document.execCommand('copy');
    } catch {
      return false;
    } finally {
      textArea.remove();
    }
  }

  private isUserCancelledShare(error: unknown): boolean {
    return error instanceof DOMException && error.name === 'AbortError';
  }
}
