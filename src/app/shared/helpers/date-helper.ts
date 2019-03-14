export class DateHelper {

  public static milisecondsBetweenDates(date1: Date, date2: Date): number {
    let diff = date1.getTime() - date2.getTime();

    return Math.abs(diff);
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

  public static addDays(date: Date, days) {
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

};
