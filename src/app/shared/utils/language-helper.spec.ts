import { afterEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_LANGUAGE_CODE, LanguageHelper } from './language-helper';

describe('LanguageHelper', () => {
  const originalLanguages = navigator.languages;
  const originalLanguage = navigator.language;

  afterEach(() => {
    vi.restoreAllMocks();
    setNavigatorValue('languages', originalLanguages);
    setNavigatorValue('language', originalLanguage);
  });

  it('gets browser language codes by browser priority', () => {
    setNavigatorValue('languages', ['fr-FR', 'es-ES']);
    setNavigatorValue('language', 'en-US');

    expect(LanguageHelper.getBrowserLanguageCodes()).toEqual(['fr-FR', 'es-ES']);
  });

  it('falls back to the primary browser language', () => {
    setNavigatorValue('languages', []);
    setNavigatorValue('language', 'de-DE');

    expect(LanguageHelper.getBrowserLanguageCodes()).toEqual(['de-DE']);
  });

  it('returns an empty language list when the browser exposes none', () => {
    setNavigatorValue('languages', []);
    setNavigatorValue('language', '');

    expect(LanguageHelper.getBrowserLanguageCodes()).toEqual([]);
  });

  it('normalizes supported language tags', () => {
    expect(LanguageHelper.getSupportedLanguageCode('en')).toBe('en');
    expect(LanguageHelper.getSupportedLanguageCode('en-US')).toBe('en');
    expect(LanguageHelper.getSupportedLanguageCode('EN-us')).toBe('en');
    expect(LanguageHelper.getSupportedLanguageCode('es')).toBe('es');
    expect(LanguageHelper.getSupportedLanguageCode('es-ES')).toBe('es');
    expect(LanguageHelper.getSupportedLanguageCode(' es_MX ')).toBe('es');
    expect(LanguageHelper.getSupportedLanguageCode('de-DE')).toBe('de');
    expect(LanguageHelper.getSupportedLanguageCode('fr-FR')).toBe('fr');
    expect(LanguageHelper.getSupportedLanguageCode('it-IT')).toBe('it');
    expect(LanguageHelper.getSupportedLanguageCode('pt-BR')).toBe('pt');
    expect(LanguageHelper.getSupportedLanguageCode('pt_BR_variant')).toBe('pt');
  });

  it('rejects empty and unsupported language tags', () => {
    expect(LanguageHelper.getSupportedLanguageCode('')).toBeNull();
    expect(LanguageHelper.getSupportedLanguageCode('   ')).toBeNull();
    expect(LanguageHelper.getSupportedLanguageCode(null)).toBeNull();
    expect(LanguageHelper.getSupportedLanguageCode(undefined)).toBeNull();
    expect(LanguageHelper.getSupportedLanguageCode('zh-Hant-TW')).toBeNull();
    expect(LanguageHelper.getSupportedLanguageCode('ja-JP')).toBeNull();
  });

  it('rejects words that only start with a supported language code', () => {
    expect(LanguageHelper.getSupportedLanguageCode('deutsch')).toBeNull();
    expect(LanguageHelper.getSupportedLanguageCode('english')).toBeNull();
    expect(LanguageHelper.getSupportedLanguageCode('esoteric')).toBeNull();
    expect(LanguageHelper.getSupportedLanguageCode('french')).toBeNull();
    expect(LanguageHelper.getSupportedLanguageCode('italian')).toBeNull();
    expect(LanguageHelper.getSupportedLanguageCode('portuguese')).toBeNull();
  });

  it('keeps Spanish variants as Spanish', () => {
    expect(LanguageHelper.normalizeLanguageCode('es-MX')).toBe('es');
  });

  it('falls back to English for unsupported languages', () => {
    expect(LanguageHelper.normalizeLanguageCode('ja-JP')).toBe('en');
    expect(LanguageHelper.normalizeLanguageCode(null)).toBe('en');
  });

  it('uses the first supported browser language by priority', () => {
    expect(LanguageHelper.getPreferredLanguageCode(['ja-JP', 'fr-FR', 'es-ES'])).toBe('fr');
    expect(LanguageHelper.getPreferredLanguageCode(['ja-JP', 'en-US', 'es-ES'])).toBe('en');
  });

  it('skips blank browser language entries', () => {
    expect(LanguageHelper.getPreferredLanguageCode([undefined, null, '', '   ', 'es-ES'])).toBe(
      'es',
    );
  });

  it('defaults to English when no browser language is supported', () => {
    expect(LanguageHelper.getPreferredLanguageCode(['ja-JP', 'zh-Hant-TW'])).toBe('en');
    expect(LanguageHelper.getPreferredLanguageCode([])).toBe('en');
  });

  it('uses a supported stored language before browser languages', () => {
    expect(LanguageHelper.getAppLanguageCode('es', ['en-US'])).toBe('es');
    expect(LanguageHelper.getAppLanguageCode('en', ['es-ES'])).toBe('en');
  });

  it('ignores unsupported stored languages and falls back to browser priority', () => {
    expect(LanguageHelper.getAppLanguageCode('ja-JP', ['es-ES', 'en-US'])).toBe('es');
    expect(LanguageHelper.getAppLanguageCode('english', ['es-ES'])).toBe('es');
    expect(LanguageHelper.getAppLanguageCode('', ['es-ES'])).toBe('es');
  });

  it('defaults app language to English when storage and browser languages are unsupported', () => {
    expect(LanguageHelper.getAppLanguageCode('ja-JP', ['zh-Hant-TW'])).toBe(DEFAULT_LANGUAGE_CODE);
    expect(LanguageHelper.getAppLanguageCode(null, [])).toBe(DEFAULT_LANGUAGE_CODE);
  });

  it('maps Open Graph locales for supported languages', () => {
    expect(LanguageHelper.getOpenGraphLocale('de')).toBe('de_DE');
    expect(LanguageHelper.getOpenGraphLocale('en')).toBe('en_GB');
    expect(LanguageHelper.getOpenGraphLocale('es')).toBe('es_ES');
    expect(LanguageHelper.getOpenGraphLocale('fr')).toBe('fr_FR');
    expect(LanguageHelper.getOpenGraphLocale('it')).toBe('it_IT');
    expect(LanguageHelper.getOpenGraphLocale('pt')).toBe('pt_PT');
    expect(LanguageHelper.getAlternateOpenGraphLocale('en')).toBe('es_ES');
    expect(LanguageHelper.getAlternateOpenGraphLocale('es')).toBe('en_GB');
    expect(LanguageHelper.getAlternateOpenGraphLocale('de')).toBe('en_GB');
  });

  function setNavigatorValue(key: 'language' | 'languages', value: unknown): void {
    Object.defineProperty(navigator, key, {
      configurable: true,
      value,
    });
  }
});
