import '@angular/compiler';
import { DOCUMENT, Injector, runInInjectionContext } from '@angular/core';
import '@angular/localize/init';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ClockService } from './clock.service';

describe('ClockService', () => {
  let hidden: boolean;
  let documentStub: Pick<Document, 'addEventListener' | 'removeEventListener'> & {
    hidden: boolean;
  };
  let visibilityListeners: (() => void)[];

  let injectors: { destroy?: () => void }[];

  const createClockService = (): ClockService => {
    const injector = Injector.create({
      providers: [{ provide: DOCUMENT, useValue: documentStub }],
    });

    injectors.push(injector as unknown as { destroy?: () => void });

    return runInInjectionContext(injector, () => new ClockService());
  };

  const triggerVisibilityChange = (isHidden: boolean): void => {
    hidden = isHidden;
    visibilityListeners.forEach((listener) => listener());
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-05T10:00:00.000Z'));

    injectors = [];
    hidden = false;
    visibilityListeners = [];
    documentStub = {
      get hidden(): boolean {
        return hidden;
      },
      set hidden(value: boolean) {
        hidden = value;
      },
      addEventListener: vi.fn((_type: string, listener: () => void) => {
        visibilityListeners.push(listener);
      }),
      removeEventListener: vi.fn((_type: string, listener: () => void) => {
        visibilityListeners = visibilityListeners.filter((current) => current !== listener);
      }),
    } as unknown as typeof documentStub;
  });

  afterEach(() => {
    // Also detaches the window 'pageshow' listeners so they cannot leak between tests.
    injectors.forEach((injector) => injector.destroy?.());

    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('ticks once per second while the page is visible', () => {
    const clockService = createClockService();

    expect(clockService.now().toISOString()).toBe('2026-08-05T10:00:00.000Z');

    vi.advanceTimersByTime(1000);
    expect(clockService.now().toISOString()).toBe('2026-08-05T10:00:01.000Z');

    vi.advanceTimersByTime(1000);
    expect(clockService.now().toISOString()).toBe('2026-08-05T10:00:02.000Z');
  });

  it('stops ticking while the page is hidden', () => {
    const clockService = createClockService();

    triggerVisibilityChange(true);

    vi.advanceTimersByTime(60_000);

    expect(clockService.now().toISOString()).toBe('2026-08-05T10:00:00.000Z');
  });

  it('resyncs immediately when the page becomes visible again', () => {
    const clockService = createClockService();

    triggerVisibilityChange(true);
    vi.advanceTimersByTime(60_000);
    triggerVisibilityChange(false);

    // Without the resync the next value would only arrive on the pending tick,
    // which browsers throttle to once a minute in hidden tabs.
    expect(clockService.now().toISOString()).toBe('2026-08-05T10:01:00.000Z');
  });

  it('restarts on a cache restore that only fires pageshow', () => {
    const clockService = createClockService();

    triggerVisibilityChange(true);
    vi.advanceTimersByTime(60_000);

    // Back/forward cache restore: the page is visible again but some browsers
    // only deliver pageshow, and the tick was cleared when it went hidden.
    hidden = false;
    window.dispatchEvent(new Event('pageshow'));

    expect(clockService.now().toISOString()).toBe('2026-08-05T10:01:00.000Z');

    vi.advanceTimersByTime(1000);
    expect(clockService.now().toISOString()).toBe('2026-08-05T10:01:01.000Z');
  });

  it('does not start ticking when created while the page is hidden', () => {
    hidden = true;

    const clockService = createClockService();

    vi.advanceTimersByTime(60_000);

    expect(clockService.now().toISOString()).toBe('2026-08-05T10:00:00.000Z');
  });

  it('aligns ticks to the next whole second', () => {
    vi.setSystemTime(new Date('2026-08-05T10:00:00.400Z'));

    const clockService = createClockService();

    vi.advanceTimersByTime(599);
    expect(clockService.now().toISOString()).toBe('2026-08-05T10:00:00.400Z');

    vi.advanceTimersByTime(1);
    expect(clockService.now().toISOString()).toBe('2026-08-05T10:00:01.000Z');
  });
});
