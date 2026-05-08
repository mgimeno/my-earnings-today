export type SupportedLanguageCode = 'en' | 'es';

export const DEFAULT_LANGUAGE_CODE: SupportedLanguageCode = 'en';
export const LANGUAGE_STORAGE_KEY = 'language';

export class LanguageHelper {
  static getSupportedLanguageCode(
    languageCode: string | null | undefined,
  ): SupportedLanguageCode | null {
    const normalizedLanguageCode = languageCode
      ?.trim()
      .replace('_', '-')
      .split('-')[0]
      ?.toLowerCase();

    if (normalizedLanguageCode === 'en' || normalizedLanguageCode === 'es') {
      return normalizedLanguageCode;
    }

    return null;
  }

  static normalizeLanguageCode(languageCode: string | null | undefined): SupportedLanguageCode {
    return this.getSupportedLanguageCode(languageCode) ?? DEFAULT_LANGUAGE_CODE;
  }

  static getPreferredLanguageCode(
    languageCodes: readonly (string | null | undefined)[],
  ): SupportedLanguageCode {
    for (const languageCode of languageCodes) {
      const supportedLanguageCode = this.getSupportedLanguageCode(languageCode);

      if (supportedLanguageCode) {
        return supportedLanguageCode;
      }
    }

    return DEFAULT_LANGUAGE_CODE;
  }

  static getAppLanguageCode(
    storedLanguageCode: string | null | undefined,
    browserLanguageCodes: readonly (string | null | undefined)[],
  ): SupportedLanguageCode {
    return (
      this.getSupportedLanguageCode(storedLanguageCode) ??
      this.getPreferredLanguageCode(browserLanguageCodes)
    );
  }

  static getOpenGraphLocale(languageCode: SupportedLanguageCode): string {
    return languageCode === 'es' ? 'es_ES' : 'en_GB';
  }

  static getAlternateOpenGraphLocale(languageCode: SupportedLanguageCode): string {
    return languageCode === 'es' ? 'en_GB' : 'es_ES';
  }
}
