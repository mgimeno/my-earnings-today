export type SupportedLanguageCode = 'de' | 'en' | 'es' | 'fr' | 'it' | 'pt';

export const DEFAULT_LANGUAGE_CODE: SupportedLanguageCode = 'en';
export const LANGUAGE_STORAGE_KEY = 'language';
export const SUPPORTED_LANGUAGE_CODES: readonly SupportedLanguageCode[] = [
  'de',
  'en',
  'es',
  'fr',
  'it',
  'pt',
];

const OPEN_GRAPH_LOCALES: Record<SupportedLanguageCode, string> = {
  de: 'de_DE',
  en: 'en_GB',
  es: 'es_ES',
  fr: 'fr_FR',
  it: 'it_IT',
  pt: 'pt_PT',
};

export class LanguageHelper {
  static getSupportedLanguageCode(
    languageCode: string | null | undefined,
  ): SupportedLanguageCode | null {
    const normalizedLanguageCode = languageCode
      ?.trim()
      .replace('_', '-')
      .split('-')[0]
      ?.toLowerCase();

    return SUPPORTED_LANGUAGE_CODES.find((code) => code === normalizedLanguageCode) ?? null;
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
    return OPEN_GRAPH_LOCALES[languageCode];
  }

  static getAlternateOpenGraphLocale(languageCode: SupportedLanguageCode): string {
    return OPEN_GRAPH_LOCALES[
      languageCode === DEFAULT_LANGUAGE_CODE ? 'es' : DEFAULT_LANGUAGE_CODE
    ];
  }
}
