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

  it('uses the first supported browser language by priority', () => {
    expect(LanguageHelper.getPreferredLanguageCode(['fr-FR', 'es-ES', 'en-US'])).toBe('es');
    expect(LanguageHelper.getPreferredLanguageCode(['fr-FR', 'en-US', 'es-ES'])).toBe('en');
  });

  it('defaults to English when no browser language is supported', () => {
    expect(LanguageHelper.getPreferredLanguageCode(['fr-FR', 'de-DE'])).toBe('en');
    expect(LanguageHelper.getPreferredLanguageCode([])).toBe('en');
  });

  it('maps Open Graph locales for supported languages', () => {
    expect(LanguageHelper.getOpenGraphLocale('en')).toBe('en_GB');
    expect(LanguageHelper.getOpenGraphLocale('es')).toBe('es_ES');
    expect(LanguageHelper.getAlternateOpenGraphLocale('en')).toBe('es_ES');
    expect(LanguageHelper.getAlternateOpenGraphLocale('es')).toBe('en_GB');
  });
});
