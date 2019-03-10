export namespace Helpers {

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

  };
}
