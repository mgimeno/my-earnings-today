import { describe, expect, it } from 'vitest';
import { SUPPORTED_LANGUAGE_CODES } from '../app/shared/utils/language-helper';
import { APP_TRANSLATIONS } from './translations';

describe('APP_TRANSLATIONS', () => {
  it('has one complete translation map for each supported non-English language', () => {
    const translatedLanguageCodes = SUPPORTED_LANGUAGE_CODES.filter(
      (languageCode) => languageCode !== 'en',
    );
    const referenceKeys = Object.keys(APP_TRANSLATIONS.es ?? {}).sort();

    expect(referenceKeys.length).toBeGreaterThan(0);

    translatedLanguageCodes.forEach((languageCode) => {
      expect(Object.keys(APP_TRANSLATIONS[languageCode] ?? {}).sort()).toEqual(referenceKeys);
    });
  });
});
