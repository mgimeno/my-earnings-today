import { describe, expect, it } from 'vitest';
import { CommonHelper } from './common-helper';

describe('CommonHelper', () => {
  it('classifies screen sizes from shared breakpoints', () => {
    expect(CommonHelper.getScreenSize(320)).toBe('mobile');
    expect(CommonHelper.getScreenSize(639)).toBe('mobile');
    expect(CommonHelper.getScreenSize(640)).toBe('tablet');
    expect(CommonHelper.getScreenSize(799)).toBe('tablet');
    expect(CommonHelper.getScreenSize(800)).toBe('desktop');
  });

  it('keeps large screen behavior tied to desktop screens', () => {
    expect(CommonHelper.isMobileScreen(639)).toBe(true);
    expect(CommonHelper.isTabletScreen(640)).toBe(true);
    expect(CommonHelper.isDesktopScreen(800)).toBe(true);
    expect(CommonHelper.isLargeScreen()).toBe(CommonHelper.isDesktopScreen());
  });
});
