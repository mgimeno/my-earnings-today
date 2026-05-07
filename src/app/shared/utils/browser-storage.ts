export class BrowserStorage {
  static getLocalStorageItem(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  static setLocalStorageItem(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Storage can be blocked by the browser. The app can still run without it.
    }
  }

  static removeLocalStorageItem(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Storage can be blocked by the browser. The app can still run without it.
    }
  }
}
