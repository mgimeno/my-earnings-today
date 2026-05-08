import '@angular/localize/init';
import { describe, expect, it } from 'vitest';
import { AppConstants } from '../constants/app.constant';
import { CurrencyHelper } from './currency-helper';

describe('CurrencyHelper', () => {
  it('keeps supported currency symbols', () => {
    expect(CurrencyHelper.getSupportedCurrencySymbol('€')).toBe('€');
    expect(CurrencyHelper.getSupportedCurrencySymbol(' $ ')).toBe('$');
  });

  it('rejects empty and unsupported currency symbols', () => {
    expect(CurrencyHelper.getSupportedCurrencySymbol('')).toBeNull();
    expect(CurrencyHelper.getSupportedCurrencySymbol('   ')).toBeNull();
    expect(CurrencyHelper.getSupportedCurrencySymbol(null)).toBeNull();
    expect(CurrencyHelper.getSupportedCurrencySymbol(undefined)).toBeNull();
    expect(CurrencyHelper.getSupportedCurrencySymbol('A$')).toBeNull();
  });

  it('uses the first supported browser currency by locale priority', () => {
    expect(CurrencyHelper.getPreferredCurrencySymbol(['en-GB', 'es-ES'])).toBe('£');
    expect(CurrencyHelper.getPreferredCurrencySymbol(['es-ES', 'en-GB'])).toBe('€');
  });

  it('supports locale tags with underscores and inferred regions', () => {
    expect(CurrencyHelper.getPreferredCurrencySymbol(['pt_BR'])).toBe('R$');
    expect(CurrencyHelper.getPreferredCurrencySymbol(['en'])).toBe('$');
    expect(CurrencyHelper.getPreferredCurrencySymbol(['es'])).toBe('€');
  });

  it('skips browser currencies that are not supported by the select options', () => {
    expect(CurrencyHelper.getPreferredCurrencySymbol(['en-GB', 'es-ES'], ['$', '€'])).toBe('€');
  });

  it('defaults to dollars when browser settings do not map to a supported symbol', () => {
    expect(CurrencyHelper.getPreferredCurrencySymbol(['ar-EG'])).toBe(
      AppConstants.Common.DEFAULT_CURRENCY_SYMBOL,
    );
    expect(CurrencyHelper.getPreferredCurrencySymbol([])).toBe(
      AppConstants.Common.DEFAULT_CURRENCY_SYMBOL,
    );
    expect(CurrencyHelper.getPreferredCurrencySymbol([null, undefined, '', '   '])).toBe(
      AppConstants.Common.DEFAULT_CURRENCY_SYMBOL,
    );
  });
});
