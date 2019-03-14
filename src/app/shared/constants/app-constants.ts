import { INameValue } from '../intefaces/name-value.interface';

export namespace AppConstants {

  export class Common {

    public static readonly CURRENCY_SYMBOLS: Array<string> = ["£", "$", "€", "‎₽", "CN¥", "C$", "₣", "₹", "kr", "￥", "zł", "R$", "₴", "₩", "฿", "₫", "₲", "₱", "₦", "₪", "₡", "৳"];

    public static readonly FREQUENCIES: Array<INameValue> = [
      { name: "Per hour", value: "hour" },
      { name: "Per day", value: "day" },
      { name: "Per week", value: "week" },
      { name: "Per month", value: "month" },
      { name: "Per year", value: "year" }
    ];

    public static readonly UPDATE_AMOUNTS_FREQUENCY_IN_MS: number = 100;

  };
}
