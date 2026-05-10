import { afterEach, describe, expect, it, vi } from 'vitest';
import { APP_SCROLL_CONTAINER_ATTRIBUTE, ScrollHelper } from './scroll-helper';

describe('ScrollHelper', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('scrolls the app scroll container and window to the top', () => {
    const windowScrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    const appScrollContainer = document.createElement('div');
    const appScrollContainerScrollTo = vi.fn();

    appScrollContainer.setAttribute(APP_SCROLL_CONTAINER_ATTRIBUTE, '');
    appScrollContainer.scrollTo = appScrollContainerScrollTo;
    document.body.appendChild(appScrollContainer);

    ScrollHelper.scrollToTop();

    expect(appScrollContainerScrollTo).toHaveBeenCalledWith({ top: 0, left: 0 });
    expect(windowScrollTo).toHaveBeenCalledWith({ top: 0, left: 0 });
  });

  it('can scroll a provided container', () => {
    const windowScrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    const scrollContainer = document.createElement('div');
    const scrollContainerScrollTo = vi.fn();

    scrollContainer.scrollTo = scrollContainerScrollTo;

    ScrollHelper.scrollToTop(scrollContainer);

    expect(scrollContainerScrollTo).toHaveBeenCalledWith({ top: 0, left: 0 });
    expect(windowScrollTo).toHaveBeenCalledWith({ top: 0, left: 0 });
  });
});
