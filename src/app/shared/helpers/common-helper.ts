

export class CommonHelper {

  public static isEmptyObject(obj) {
    return (Object.getOwnPropertyNames(obj).length === 0);
  }

  public static isLargeScreen(): boolean {
    return window.innerWidth >= 800;
  }

};

