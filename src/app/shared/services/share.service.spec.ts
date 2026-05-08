import '@angular/compiler';
import { Injector, runInInjectionContext } from '@angular/core';
import '@angular/localize/init';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationService } from './notification.service';
import { ShareService } from './share.service';

describe('ShareService', () => {
  const originalClipboard = navigator.clipboard;
  const originalShare = navigator.share;
  const originalExecCommand = document.execCommand;

  let injector: Injector;
  let notificationService: { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };
  let shareService: ShareService;

  beforeEach(() => {
    notificationService = {
      success: vi.fn(),
      error: vi.fn(),
    };
    injector = Injector.create({
      providers: [{ provide: NotificationService, useValue: notificationService }],
    });
    shareService = runInInjectionContext(injector, () => new ShareService());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    setNavigatorValue('clipboard', originalClipboard);
    setNavigatorValue('share', originalShare);
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: originalExecCommand,
    });
  });

  it('uses native share when available', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const writeText = vi.fn().mockResolvedValue(undefined);
    setNavigatorValue('share', share);
    setNavigatorValue('clipboard', { writeText });

    await shareService.shareCurrentUrl();

    expect(share).toHaveBeenCalledWith({ url: window.location.href });
    expect(writeText).not.toHaveBeenCalled();
    expect(notificationService.success).not.toHaveBeenCalled();
  });

  it('copies the current URL and shows success when native share is unavailable', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setNavigatorValue('share', undefined);
    setNavigatorValue('clipboard', { writeText });

    await shareService.shareCurrentUrl();

    expect(writeText).toHaveBeenCalledWith(window.location.href);
    expect(notificationService.success).toHaveBeenCalledWith('Link copied');
  });

  it('does nothing when the user cancels native share', async () => {
    const share = vi.fn().mockRejectedValue(new DOMException('Cancelled', 'AbortError'));
    setNavigatorValue('share', share);

    await shareService.shareCurrentUrl();

    expect(notificationService.success).not.toHaveBeenCalled();
    expect(notificationService.error).not.toHaveBeenCalled();
  });

  it('shows an error when the URL cannot be copied', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('blocked'));
    setNavigatorValue('share', undefined);
    setNavigatorValue('clipboard', { writeText });
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: vi.fn().mockReturnValue(false),
    });

    await shareService.shareCurrentUrl();

    expect(notificationService.error).toHaveBeenCalledWith('Could not copy link');
  });

  function setNavigatorValue(key: 'clipboard' | 'share', value: unknown): void {
    Object.defineProperty(navigator, key, {
      configurable: true,
      value,
    });
  }
});
