import { INameValue } from '../intefaces/name-value.interface';

export namespace AppConstants {

  export class Common {

    public static readonly CURRENCY_SYMBOLS: Array<string> = ["£", "$", "€", "‎₽", "Fr.", "kr", "CN¥", "C$", "₣", "₹", "￥", "zł", "R$", "₴", "₩", "฿", "₫", "₲", "₱", "₦", "₪", "₡", "৳"];

    public static readonly FREQUENCIES: Array<INameValue> = [
      { name: "per hour", value: "hour" },
      { name: "per day", value: "day" },
      { name: "per week", value: "week" },
      { name: "per month", value: "month" },
      { name: "per year", value: "year" }
    ];

    public static readonly UPDATE_AMOUNTS_FREQUENCY_IN_MS: number = 100;

    public static readonly UPDATE_STOPWATCH_FREQUENCY_IN_MS: number = 100;

    public static readonly FIRST_USER_DEFAULT_NAME = "You";
  };
}
