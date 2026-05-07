export type SupportedLanguageCode = 'en' | 'es';

export const DEFAULT_LANGUAGE_CODE: SupportedLanguageCode = 'en';
export const LANGUAGE_STORAGE_KEY = 'language';

export class LanguageHelper {
  static normalizeLanguageCode(languageCode: string | null | undefined): SupportedLanguageCode {
    return languageCode?.slice(0, 2).toLowerCase() === 'es' ? 'es' : DEFAULT_LANGUAGE_CODE;
  }

  static getOpenGraphLocale(languageCode: SupportedLanguageCode): string {
    return languageCode === 'es' ? 'es_ES' : 'en_GB';
  }

  static getAlternateOpenGraphLocale(languageCode: SupportedLanguageCode): string {
    return languageCode === 'es' ? 'en_GB' : 'es_ES';
  }
}
