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

    public static readonly TILES: any[] = [
      { codeName: "stopwatch", title: $localize`:@@tiles.stopwatch:Stopwatch`, amountProperty: 'stopwatchAmount', totalAmountProperty: null },
      { codeName: "hour", title: $localize`:@@tiles.this-hour:This hour`, amountProperty: 'currentHourAmount', totalAmountProperty: 'totalHourAmount' },
      { codeName: "today", title: $localize`:@@tiles.today:today`, amountProperty: 'currentDayAmount', totalAmountProperty: 'totalDayAmount' },
      { codeName: "week", title: $localize`:@@tiles.this-week:This week`, amountProperty: 'currentWeekAmount', totalAmountProperty: 'totalWeekAmount' },
      { codeName: "month", title: $localize`:@@tiles.this-month:This month`, amountProperty: 'currentMonthAmount', totalAmountProperty: 'totalMonthAmount' },
      { codeName: "year", title: $localize`:@@tiles.this-year:This year`, amountProperty: 'currentYearAmount', totalAmountProperty: 'totalYearAmount' }
    ];

    public static readonly CHART_BACKGROUND_COLOURS: string[] = [
      "rgb(255, 99, 132)",
      "#3e95cd",
      "rgb(255, 205, 86)",
      "#8e5ea2",
      "#71cdcd"
    ];
  };
}
