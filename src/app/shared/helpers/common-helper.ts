

export class CommonHelper {

  public static isEmptyObject(obj) {
    return (Object.getOwnPropertyNames(obj).length === 0);
  }

  public static isLargeScreen(): boolean {
    return window.innerWidth >= 800;
  }

  public static getLocaleDecimalSeparator() {
    const n = 1.1;
    return n.toLocaleString().substring(1, 2);
  }

};

