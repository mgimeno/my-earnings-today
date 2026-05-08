import type { SupportedLanguageCode } from '../app/shared/utils/language-helper';
import type { AppTranslations } from './app-translations';
import { DE_TRANSLATIONS } from './de';
import { ES_TRANSLATIONS } from './es';
import { FR_TRANSLATIONS } from './fr';
import { IT_TRANSLATIONS } from './it';
import { PT_TRANSLATIONS } from './pt';

export const APP_TRANSLATIONS: Partial<Record<SupportedLanguageCode, AppTranslations>> = {
  de: DE_TRANSLATIONS,
  es: ES_TRANSLATIONS,
  fr: FR_TRANSLATIONS,
  it: IT_TRANSLATIONS,
  pt: PT_TRANSLATIONS,
};
