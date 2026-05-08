import '@angular/localize/init';
import { describe, expect, it } from 'vitest';
import { UserSelection } from './user-selection.model';

describe('UserSelection', () => {
  it('rejects non-finite rates', () => {
    const userSelection = new UserSelection(1);

    userSelection.rate = Infinity;

    expect(userSelection.hasRate()).toBe(false);
  });

  it('uses weekdays as the default working week', () => {
    const userSelection = new UserSelection(1);
    const monday = new Date(2026, 4, 4);
    const sunday = new Date(2026, 4, 10);

    userSelection.setDefaultValues();

    expect(userSelection.hasDayOff(monday)).toBe(false);
    expect(userSelection.hasDayOff(sunday)).toBe(true);
  });

  it('uses the browser locale for the default currency symbol', () => {
    const userSelection = new UserSelection(1);

    userSelection.setDefaultValues(['en-GB']);

    expect(userSelection.currencySymbol).toBe('£');
  });

  it('defaults currency symbol to dollars when browser locale is unsupported', () => {
    const userSelection = new UserSelection(1);

    userSelection.setDefaultValues(['ar-EG']);

    expect(userSelection.currencySymbol).toBe('$');
  });
});
