import { INameValue } from '../intefaces/name-value.interface';

export namespace AppConstants {

  export class Common {

    public static readonly CURRENCY_SYMBOLS: Array<string> = ["£", "$", "€", "‎₽", "Fr.", "kr", "CN¥", "C$", "₣", "₹", "￥", "zł", "R$", "₴", "₩", "฿", "₫", "₲", "₱", "₦", "₪", "₡", "৳"];

    public static readonly FREQUENCIES: Array<INameValue> = [
      { name: $localize`:@@frequencies.per-hour:per hour`, value: "hour" },
      { name: $localize`:@@frequencies.per-day:per day`, value: "day" },
      { name: $localize`:@@frequencies.per-week:per week`, value: "week" },
      { name: $localize`:@@frequencies.per-month:per month`, value: "month" },
      { name: $localize`:@@frequencies.per-year:per year`, value: "year" }
    ];

    public static readonly UPDATE_AMOUNTS_FREQUENCY_IN_MS: number = 100;

    public static readonly UPDATE_STOPWATCH_FREQUENCY_IN_MS: number = 100;

    public static readonly FIRST_USER_DEFAULT_NAME = $localize`:@@first-user-default-name:You`;
  };
}
