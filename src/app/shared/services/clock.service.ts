import { DestroyRef, DOCUMENT, inject, Injectable, signal } from '@angular/core';

const TICK_INTERVAL_IN_MS = 1000;

/**
 * Single wall clock every live counter in the app renders from.
 *
 * Ticking stops while the page is hidden: all amounts are recomputed from the
 * clock rather than accumulated, so there is nothing to keep up to date in a
 * background tab. Becoming visible resyncs immediately instead of waiting for
 * the pending tick, which browsers throttle to once a minute in hidden tabs.
 *
 * `pageshow` is handled as well as `visibilitychange` because the tick is
 * cleared while hidden: a back/forward cache restore that only fires `pageshow`
 * would otherwise leave the clock stopped for good.
 *
 * Focus is deliberately not tracked. A visible but unfocused window is not
 * throttled, so pausing on blur would freeze a counter the user can still see.
 */
@Injectable({
  providedIn: 'root',
})
export class ClockService {
  private readonly document = inject(DOCUMENT);
  private readonly currentTime = signal(new Date());

  readonly now = this.currentTime.asReadonly();

  private tickTimeoutId: number | null = null;

  constructor() {
    this.document.addEventListener('visibilitychange', this.syncWithPageVisibility);
    window.addEventListener('pageshow', this.syncWithPageVisibility);

    inject(DestroyRef).onDestroy(() => {
      this.document.removeEventListener('visibilitychange', this.syncWithPageVisibility);
      window.removeEventListener('pageshow', this.syncWithPageVisibility);
      this.stop();
    });

    this.syncWithPageVisibility();
  }

  private readonly syncWithPageVisibility = (): void => {
    if (this.document.hidden) {
      this.stop();
      return;
    }

    this.currentTime.set(new Date());
    this.start();
  };

  private start(): void {
    this.stop();
    this.scheduleNextTick();
  }

  private scheduleNextTick(): void {
    // Aim at the next whole second rather than using a fixed interval, which
    // drifts away from the clock over time.
    const delayInMs = TICK_INTERVAL_IN_MS - (Date.now() % TICK_INTERVAL_IN_MS);

    this.tickTimeoutId = window.setTimeout(() => {
      this.currentTime.set(new Date());
      this.scheduleNextTick();
    }, delayInMs);
  }

  private stop(): void {
    if (this.tickTimeoutId !== null) {
      clearTimeout(this.tickTimeoutId);
      this.tickTimeoutId = null;
    }
  }
}
