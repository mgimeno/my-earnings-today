import { AppConstants } from '../constants/app.constant';

export class CurrencyHelper {
  private static readonly REGION_CURRENCY_SYMBOLS = new Map<string, string>([
    ['AD', '€'],
    ['AR', '$'],
    ['AT', '€'],
    ['AU', '$'],
    ['BD', '৳'],
    ['BE', '€'],
    ['BR', 'R$'],
    ['CA', 'C$'],
    ['CH', 'Fr.'],
    ['CN', 'CN¥'],
    ['CO', '$'],
    ['CR', '₡'],
    ['CY', '€'],
    ['DE', '€'],
    ['DK', 'kr'],
    ['EE', '€'],
    ['ES', '€'],
    ['FI', '€'],
    ['FR', '€'],
    ['GB', '£'],
    ['GR', '€'],
    ['HK', '$'],
    ['HR', '€'],
    ['IE', '€'],
    ['IL', '₪'],
    ['IN', '₹'],
    ['IS', 'kr'],
    ['IT', '€'],
    ['JP', '￥'],
    ['KR', '₩'],
    ['LI', 'Fr.'],
    ['LT', '€'],
    ['LU', '€'],
    ['LV', '€'],
    ['MC', '€'],
    ['ME', '€'],
    ['MT', '€'],
    ['MX', '$'],
    ['NG', '₦'],
    ['NL', '€'],
    ['NO', 'kr'],
    ['NZ', '$'],
    ['PH', '₱'],
    ['PL', 'zł'],
    ['PT', '€'],
    ['PY', '₲'],
    ['RU', '‎₽'],
    ['SE', 'kr'],
    ['SG', '$'],
    ['SI', '€'],
    ['SK', '€'],
    ['SM', '€'],
    ['TH', '฿'],
    ['UA', '₴'],
    ['US', '$'],
    ['VA', '€'],
    ['VN', '₫'],
    ['XK', '€'],
  ]);

  static getBrowserLanguageCodes(): readonly string[] {
    if (navigator.languages.length) {
      return navigator.languages;
    }

    return navigator.language ? [navigator.language] : [];
  }

  static getSupportedCurrencySymbol(
    currencySymbol: string | null | undefined,
    supportedCurrencySymbols: readonly string[] = AppConstants.Common.CURRENCY_SYMBOLS,
  ): string | null {
    const normalizedCurrencySymbol = currencySymbol?.trim();

    if (normalizedCurrencySymbol && supportedCurrencySymbols.includes(normalizedCurrencySymbol)) {
      return normalizedCurrencySymbol;
    }

    return null;
  }

  static getPreferredCurrencySymbol(
    languageCodes: readonly (string | null | undefined)[] =
      CurrencyHelper.getBrowserLanguageCodes(),
    supportedCurrencySymbols: readonly string[] = AppConstants.Common.CURRENCY_SYMBOLS,
  ): string {
    for (const languageCode of languageCodes) {
      const currencySymbol = this.getCurrencySymbolFromLanguageCode(languageCode);
      const supportedCurrencySymbol = this.getSupportedCurrencySymbol(
        currencySymbol,
        supportedCurrencySymbols,
      );

      if (supportedCurrencySymbol) {
        return supportedCurrencySymbol;
      }
    }

    return AppConstants.Common.DEFAULT_CURRENCY_SYMBOL;
  }

  private static getCurrencySymbolFromLanguageCode(
    languageCode: string | null | undefined,
  ): string | null {
    const regionCode = this.getRegionCode(languageCode);

    return regionCode ? (this.REGION_CURRENCY_SYMBOLS.get(regionCode) ?? null) : null;
  }

  private static getRegionCode(languageCode: string | null | undefined): string | null {
    const normalizedLanguageCode = languageCode?.trim().replace(/_/g, '-');

    if (!normalizedLanguageCode) {
      return null;
    }

    const regionCode = this.getRegionCodeFromIntlLocale(normalizedLanguageCode);

    if (regionCode) {
      return regionCode;
    }

    return this.getRegionCodeFromLanguageTag(normalizedLanguageCode);
  }

  private static getRegionCodeFromIntlLocale(languageCode: string): string | null {
    try {
      return new Intl.Locale(languageCode).maximize().region?.toUpperCase() ?? null;
    } catch {
      return null;
    }
  }

  private static getRegionCodeFromLanguageTag(languageCode: string): string | null {
    const regionCode = languageCode
      .split('-')
      .slice(1)
      .find((part) => /^[a-z]{2}$/i.test(part) || /^\d{3}$/.test(part));

    return regionCode?.toUpperCase() ?? null;
  }
}
