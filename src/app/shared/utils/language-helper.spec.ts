import { describe, expect, it } from 'vitest';
import { LanguageHelper } from './language-helper';

describe('LanguageHelper', () => {
  it('keeps Spanish variants as Spanish', () => {
    expect(LanguageHelper.normalizeLanguageCode('es-MX')).toBe('es');
  });

  it('falls back to English for unsupported languages', () => {
    expect(LanguageHelper.normalizeLanguageCode('fr-FR')).toBe('en');
    expect(LanguageHelper.normalizeLanguageCode(null)).toBe('en');
  });

  it('maps Open Graph locales for supported languages', () => {
    expect(LanguageHelper.getOpenGraphLocale('en')).toBe('en_GB');
    expect(LanguageHelper.getOpenGraphLocale('es')).toBe('es_ES');
    expect(LanguageHelper.getAlternateOpenGraphLocale('en')).toBe('es_ES');
    expect(LanguageHelper.getAlternateOpenGraphLocale('es')).toBe('en_GB');
  });
});
