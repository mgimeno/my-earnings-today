import { afterEach, describe, expect, it, vi } from 'vitest';
import { BrowserStorage } from './browser-storage';

describe('BrowserStorage', () => {
  const key = 'browser-storage-test-key';

  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it('reads, writes, and removes local storage values', () => {
    BrowserStorage.setLocalStorageItem(key, 'value');

    expect(BrowserStorage.getLocalStorageItem(key)).toBe('value');

    BrowserStorage.removeLocalStorageItem(key);

    expect(BrowserStorage.getLocalStorageItem(key)).toBeNull();
  });

  it('returns null when local storage reads are blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(BrowserStorage.getLocalStorageItem(key)).toBeNull();
  });

  it('does not throw when local storage writes are blocked', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(() => BrowserStorage.setLocalStorageItem(key, 'value')).not.toThrow();
  });

  it('does not throw when local storage removals are blocked', () => {
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(() => BrowserStorage.removeLocalStorageItem(key)).not.toThrow();
  });
});
