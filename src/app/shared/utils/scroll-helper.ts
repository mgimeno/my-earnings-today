export const APP_SCROLL_CONTAINER_ATTRIBUTE = 'data-app-scroll-container';

const APP_SCROLL_CONTAINER_SELECTOR = `[${APP_SCROLL_CONTAINER_ATTRIBUTE}]`;
const TOP_LEFT_SCROLL_POSITION: ScrollToOptions = { top: 0, left: 0 };

export class ScrollHelper {
  public static scrollToTop(scrollContainer?: HTMLElement | null): void {
    const appScrollContainer =
      scrollContainer ?? document.querySelector<HTMLElement>(APP_SCROLL_CONTAINER_SELECTOR);

    appScrollContainer?.scrollTo(TOP_LEFT_SCROLL_POSITION);
    window.scrollTo(TOP_LEFT_SCROLL_POSITION);
  }
}
