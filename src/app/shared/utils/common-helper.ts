export type ScreenSize = 'mobile' | 'tablet' | 'desktop';

export class CommonHelper {
  public static readonly TABLET_MIN_WIDTH = 640;
  public static readonly DESKTOP_MIN_WIDTH = 800;

  public static isEmptyObject(obj: object): boolean {
    return Object.getOwnPropertyNames(obj).length === 0;
  }

  public static getScreenSize(width: number = window.innerWidth): ScreenSize {
    if (width >= this.DESKTOP_MIN_WIDTH) {
      return 'desktop';
    }

    if (width >= this.TABLET_MIN_WIDTH) {
      return 'tablet';
    }

    return 'mobile';
  }

  public static isMobileScreen(width: number = window.innerWidth): boolean {
    return this.getScreenSize(width) === 'mobile';
  }

  public static isTabletScreen(width: number = window.innerWidth): boolean {
    return this.getScreenSize(width) === 'tablet';
  }

  public static isDesktopScreen(width: number = window.innerWidth): boolean {
    return this.getScreenSize(width) === 'desktop';
  }

  public static isLargeScreen(): boolean {
    return this.isDesktopScreen();
  }

  public static getLocaleDecimalSeparator(): string {
    return (1.1).toLocaleString().substring(1, 2);
  }
}
