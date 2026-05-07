import { ITimeBetweenDates } from '../intefaces/time-between-dates.interface';

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_MINUTE = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;

export class DateHelper {
  public static millisecondsBetweenDates(date1: Date, date2: Date): number {
    const diff = date1.getTime() - date2.getTime();

    return Math.abs(diff);
  }

  public static secondsBetweenDates(date1: Date, date2: Date): number {
    return this.millisecondsBetweenDates(date1, date2) / MILLISECONDS_PER_SECOND;
  }

  public static hoursBetweenDates(date1: Date, date2: Date): number {
    return (
      this.millisecondsBetweenDates(date1, date2) /
      MILLISECONDS_PER_SECOND /
      SECONDS_PER_MINUTE /
      SECONDS_PER_MINUTE
    );
  }

  public static buildDate(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);

    const result = new Date(date);
    result.setHours(hours, minutes, 0, 0);
    return result;
  }

  public static getDaysWorkedInPeriod(
    workingDaysOfTheWeek: number[],
    startDate: Date,
    endDate: Date,
  ): number {
    const start = this.getDateOnly(startDate);
    const end = this.getDateOnly(endDate);
    const workingDays = this.getValidWorkingDaysSet(workingDaysOfTheWeek);

    if (start > end || workingDays.size === 0) {
      return 0;
    }

    const totalDays = this.daysBetweenCalendarDates(start, end) + 1;
    const fullWeeks = Math.floor(totalDays / DAYS_PER_WEEK);
    const remainingDays = totalDays % DAYS_PER_WEEK;
    let daysWorked = fullWeeks * workingDays.size;

    for (let index = 0; index < remainingDays; index++) {
      const dayOfWeek = (start.getDay() + index) % DAYS_PER_WEEK;

      if (workingDays.has(dayOfWeek)) {
        daysWorked++;
      }
    }

    return daysWorked;
  }

  public static addDays(date: Date, days: number): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + days,
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    );
  }

  public static addMilliseconds(date: Date, milliseconds: number): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds() + milliseconds,
    );
  }

  public static getDateAtOneMillisecondBeforeEndOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
  }

  public static getNextDayOfWeek(date: Date, dayOfTheWeek: number): Date {
    if (!this.isValidDayOfWeek(dayOfTheWeek)) {
      return new Date(date);
    }

    let resultDate = date;

    if (resultDate.getDay() === dayOfTheWeek) {
      resultDate = DateHelper.addDays(resultDate, 1);
    }

    resultDate = new Date(resultDate.getTime());

    resultDate.setDate(resultDate.getDate() + ((7 + dayOfTheWeek - resultDate.getDay()) % 7));

    return resultDate;
  }

  public static getMondayOfCurrentWeek(now: Date): Date {
    const date = new Date(now);
    const lastMondayTime = date.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    return new Date(lastMondayTime);
  }

  public static getFirstDayOfCurrentMonth(now: Date): Date {
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  }

  public static getLastDayOfCurrentMonth(now: Date): Date {
    return new Date(now.getFullYear(), now.getMonth() + 1, 0, 0, 0, 0, 0);
  }

  public static getFirstDayOfCurrentYear(now: Date): Date {
    return new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
  }

  public static getLastDayOfCurrentYear(now: Date): Date {
    return new Date(now.getFullYear(), 11, 31, 0, 0, 0, 0);
  }

  public static isMonday(date: Date): boolean {
    return date.getDay() === 1;
  }

  public static isFirstDayOfTheMonth(date: Date): boolean {
    return date.getDate() === 1;
  }

  public static isFirstDayOfTheYear(date: Date): boolean {
    return date.getMonth() === 0 && date.getDate() === 1;
  }

  public static minDate(date1: Date, date2: Date): Date {
    if (date1 < date2) {
      return date1;
    }
    return date2;
  }

  public static maxDate(date1: Date, date2: Date): Date {
    if (date1 > date2) {
      return date1;
    }
    return date2;
  }

  public static getFormattedTimeBetweenDates(fromDate: Date, toDate: Date = new Date()): string {
    const timeBetweenDates = this.getTimeBetweenDates(fromDate, toDate);

    let hoursSeparator = ':';
    const minutesSeparator = ':';
    let hoursText = timeBetweenDates.hours.toString();

    if (timeBetweenDates.hours === 0) {
      hoursText = '';
      hoursSeparator = '';
    }

    return (
      hoursText +
      hoursSeparator +
      timeBetweenDates.minutes.toString().padStart(2, '0') +
      minutesSeparator +
      timeBetweenDates.seconds.toString().padStart(2, '0')
    );
  }

  public static getFormattedTimeBetweenDatesVerbose(
    fromDate: Date,
    toDate: Date = new Date(),
  ): string {
    const timeBetweenDates = this.getTimeBetweenDates(fromDate, toDate, true);

    const parts: string[] = [];

    if (timeBetweenDates.hours > 0) {
      const hoursText =
        timeBetweenDates.hours === 1 ? $localize`:@@hour:hour` : $localize`:@@hours:hours`;
      parts.push(`${timeBetweenDates.hours} ${hoursText}`);
    }

    if (timeBetweenDates.minutes > 0) {
      const minutesText =
        timeBetweenDates.minutes === 1
          ? $localize`:@@minute:minute`
          : $localize`:@@minutes:minutes`;
      parts.push(`${timeBetweenDates.minutes} ${minutesText}`);
    }

    if (parts.length === 0) {
      const secondsText =
        timeBetweenDates.seconds === 1
          ? $localize`:@@second:second`
          : $localize`:@@seconds:seconds`;
      parts.push(`${timeBetweenDates.seconds} ${secondsText}`);
    }

    return parts.join(' ');
  }

  private static getTimeBetweenDates(
    fromDate: Date,
    toDate: Date,
    roundSecondsUp = false,
  ): ITimeBetweenDates {
    const secondsElapsed = roundSecondsUp
      ? Math.ceil(this.secondsBetweenDates(fromDate, toDate))
      : Math.floor(this.secondsBetweenDates(fromDate, toDate));
    const hours = Math.floor(secondsElapsed / SECONDS_PER_HOUR);
    const minutes = Math.floor((secondsElapsed - hours * SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
    const seconds = secondsElapsed - hours * SECONDS_PER_HOUR - minutes * SECONDS_PER_MINUTE;

    return {
      hours,
      minutes,
      seconds,
    };
  }

  private static getDateOnly(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private static getValidWorkingDaysSet(workingDaysOfTheWeek: number[]): Set<number> {
    return new Set(workingDaysOfTheWeek.filter((dayOfWeek) => this.isValidDayOfWeek(dayOfWeek)));
  }

  private static isValidDayOfWeek(dayOfWeek: number): boolean {
    return Number.isInteger(dayOfWeek) && dayOfWeek >= 0 && dayOfWeek < DAYS_PER_WEEK;
  }

  private static daysBetweenCalendarDates(startDate: Date, endDate: Date): number {
    const startUtc = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endUtc = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    return Math.round(
      (endUtc - startUtc) /
        MILLISECONDS_PER_SECOND /
        SECONDS_PER_MINUTE /
        SECONDS_PER_MINUTE /
        HOURS_PER_DAY,
    );
  }
}
