import { describe, expect, it } from 'vitest';
import { DEFAULT_LANGUAGE_CODE, LanguageHelper } from './language-helper';

describe('LanguageHelper', () => {
  it('normalizes supported language tags', () => {
    expect(LanguageHelper.getSupportedLanguageCode('en')).toBe('en');
    expect(LanguageHelper.getSupportedLanguageCode('en-US')).toBe('en');
    expect(LanguageHelper.getSupportedLanguageCode('EN-us')).toBe('en');
    expect(LanguageHelper.getSupportedLanguageCode('es')).toBe('es');
    expect(LanguageHelper.getSupportedLanguageCode('es-ES')).toBe('es');
    expect(LanguageHelper.getSupportedLanguageCode(' es_MX ')).toBe('es');
  });

  it('rejects empty and unsupported language tags', () => {
    expect(LanguageHelper.getSupportedLanguageCode('')).toBeNull();
    expect(LanguageHelper.getSupportedLanguageCode('   ')).toBeNull();
    expect(LanguageHelper.getSupportedLanguageCode(null)).toBeNull();
    expect(LanguageHelper.getSupportedLanguageCode(undefined)).toBeNull();
    expect(LanguageHelper.getSupportedLanguageCode('fr-FR')).toBeNull();
    expect(LanguageHelper.getSupportedLanguageCode('zh-Hant-TW')).toBeNull();
  });

  it('rejects words that only start with a supported language code', () => {
    expect(LanguageHelper.getSupportedLanguageCode('english')).toBeNull();
    expect(LanguageHelper.getSupportedLanguageCode('esoteric')).toBeNull();
  });

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

  it('skips blank browser language entries', () => {
    expect(LanguageHelper.getPreferredLanguageCode([undefined, null, '', '   ', 'es-ES'])).toBe(
      'es',
    );
  });

  it('defaults to English when no browser language is supported', () => {
    expect(LanguageHelper.getPreferredLanguageCode(['fr-FR', 'de-DE'])).toBe('en');
    expect(LanguageHelper.getPreferredLanguageCode([])).toBe('en');
  });

  it('uses a supported stored language before browser languages', () => {
    expect(LanguageHelper.getAppLanguageCode('es', ['en-US'])).toBe('es');
    expect(LanguageHelper.getAppLanguageCode('en', ['es-ES'])).toBe('en');
  });

  it('ignores unsupported stored languages and falls back to browser priority', () => {
    expect(LanguageHelper.getAppLanguageCode('fr-FR', ['es-ES', 'en-US'])).toBe('es');
    expect(LanguageHelper.getAppLanguageCode('english', ['es-ES'])).toBe('es');
    expect(LanguageHelper.getAppLanguageCode('', ['es-ES'])).toBe('es');
  });

  it('defaults app language to English when storage and browser languages are unsupported', () => {
    expect(LanguageHelper.getAppLanguageCode('fr-FR', ['de-DE'])).toBe(DEFAULT_LANGUAGE_CODE);
    expect(LanguageHelper.getAppLanguageCode(null, [])).toBe(DEFAULT_LANGUAGE_CODE);
  });

  it('maps Open Graph locales for supported languages', () => {
    expect(LanguageHelper.getOpenGraphLocale('en')).toBe('en_GB');
    expect(LanguageHelper.getOpenGraphLocale('es')).toBe('es_ES');
    expect(LanguageHelper.getAlternateOpenGraphLocale('en')).toBe('es_ES');
    expect(LanguageHelper.getAlternateOpenGraphLocale('es')).toBe('en_GB');
  });
});
