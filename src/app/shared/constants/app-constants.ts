import { INameValue } from '../intefaces/name-value.interface';

export namespace AppConstants {

  export class Common {

    public static readonly CURRENCY_SYMBOLS: Array<string> = ["£", "$", "€", "‎₽", "CN¥", "C$", "₣", "₹", "kr", "￥", "zł", "R$", "₴", "₩", "฿", "₫", "₲", "₱", "₦", "₪", "₡", "৳"];

    public static readonly FREQUENCIES: Array<INameValue> = [{ name: "Per day", value: "day" }, { name: "Per hour", value: "hour" }];

    public static readonly UPDATE_AMOUNT_FREQUENCY_IN_MS: number = 100;

  };
}
