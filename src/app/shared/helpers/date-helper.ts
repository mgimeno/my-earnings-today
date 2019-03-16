
export class DateHelper {

  public static milisecondsBetweenDates(date1: Date, date2: Date): number {
    let diff = date1.getTime() - date2.getTime();

    return Math.abs(diff);
  }

  public static secondsBetweenDates(date1: Date, date2: Date): number {
    return (this.milisecondsBetweenDates(date1, date2) / 1000);
  }

  public static hoursBetweenDates(date1: Date, date2: Date): number {
    return (this.milisecondsBetweenDates(date1, date2) / 1000 / 60 / 60);
  }

  public static buildDate(date: Date, time: string): Date {
    let hours = +time.split(':')[0];
    let minutes = +time.split(':')[1];

    let result = new Date(date);
    result.setHours(hours, minutes, 0, 0);
    return result;
  }

  public static getDaysWorkedInPeriod(workingDaysOfTheWeek: Array<number>, startDate: Date, endDate: Date) {
    let ndays = 1 + Math.round((endDate.getTime() - startDate.getTime()) / (24 * 3600 * 1000));
    let sum = (a, b) => {
      return a + Math.floor((ndays + (startDate.getDay() + 6 - b) % 7) / 7);
    };
    return workingDaysOfTheWeek.reduce(sum, 0);
  }

  public static addDays(date: Date, days: number): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + days,
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    );
  }

  public static addMiliseconds(date: Date, miliseconds: number): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds() + miliseconds
    );
  }

  public static getDateAtOneMilisecondBeforeEndOfDay(date: Date): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59,
      999
    );
  }

 public static getNextDayOfWeek(date:Date, dayOfTheWeek: number): Date {

   let resultDate = date;

   if (resultDate.getDay() === dayOfTheWeek) {
     resultDate = DateHelper.addDays(resultDate, 1);
   }

   resultDate = new Date(resultDate.getTime());

   resultDate.setDate(resultDate.getDate() + (7 + dayOfTheWeek - resultDate.getDay()) % 7);

  return resultDate;
}

  public static getMondayOfCurrentWeek(now: Date): Date {
    let date = new Date(now);
    let lastMondayTime = date.setDate(now.getDate() - (now.getDay() + 6) % 7);
    return new Date(lastMondayTime);

  }

  public static getFirstDayOfCurrentMonth(now: Date): Date {
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  }

  public static getLastDayOfCurrentMonth(now: Date): Date {
    return new Date(now.getFullYear(), (now.getMonth() + 1), 0, 0, 0, 0, 0);
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
    return (date.getMonth() === 0 && date.getDate() === 1);
  }

  public static minDate(date1: Date, date2: Date): Date {
    if (date1 < date2) {
      return date1;
    }
    return date2;
  }

  public static getTimeElapsedFromDate(fromDate: Date): string {

    let now: Date = new Date();
    let secondsElapsed = this.secondsBetweenDates(fromDate, now);

    let sec_num = parseInt(secondsElapsed.toString(), 10);
    let hours = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);

    let hourSeparator = ':';
    let minuteSeparator = ':';

    let hoursText = hours.toString();
    let minutesText = minutes.toString();
    let secondsText = seconds.toString();

    if (hours == 0) { hoursText = ''; hourSeparator = ''; }
    if (minutes < 10 && hours != 0) { minutesText = "0" + minutes; }
    if (seconds < 10) { secondsText = "0" + seconds; }
    return hoursText + hourSeparator + minutesText + minuteSeparator + secondsText;
  }


}

