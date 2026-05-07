export class CommonHelper {
  public static isEmptyObject(obj: object): boolean {
    return Object.getOwnPropertyNames(obj).length === 0;
  }

  public static isLargeScreen(): boolean {
    return window.innerWidth >= 800;
  }

  public static getLocaleDecimalSeparator(): string {
    return (1.1).toLocaleString().substring(1, 2);
  }
}
