import { loadTranslations } from '@angular/localize';
import { BrowserStorage } from './app/shared/utils/browser-storage';
import { LANGUAGE_STORAGE_KEY, LanguageHelper } from './app/shared/utils/language-helper';
import { environment } from './environments/environment';
import { APP_TRANSLATIONS } from './translations/translations';

const languageStorageKey = `${environment.localStoragePrefix}${LANGUAGE_STORAGE_KEY}`;
const storedLanguage = BrowserStorage.getLocalStorageItem(languageStorageKey);
const browserLanguages = navigator.languages.length ? navigator.languages : [navigator.language];
const language = LanguageHelper.getAppLanguageCode(storedLanguage, browserLanguages);
const translations = APP_TRANSLATIONS[language];

document.documentElement.lang = language;
BrowserStorage.setLocalStorageItem(languageStorageKey, language);

if (translations) {
  loadTranslations(translations);
}
