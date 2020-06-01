import { includes } from 'lodash';
import { AppConstants } from '../constants/app-constants';
import { INameValue } from '../intefaces/name-value.interface';
import { WeekDaysEnum } from '../enums/week-days.enum';
import { DateHelper } from '../helpers/date-helper';
import { PeriodEnum } from '../enums/period.enum';

export class UserSelection {
  personNumber: number = null;
  name: string = null;
  rate: number = null;
  startTime: string = null;
  endTime: string = null;
  currencySymbol: string = null;
  frequency: INameValue = null;
  weekWorkingDays: boolean[];

  dayStartTime: Date = null;
  dayEndTime: Date = null;

  dateTimeWhenClickedCalculate: Date = null;

  hoursWorkedPerDay: number = null;
  workingDaysThisWeek: number = null;
  workingDaysThisMonth: number = null;
  workingDaysThisYear: number = null;
  workingHoursThisWeek: number = null;
  workingHoursThisMonth: number = null;
  workingHoursThisYear: number = null;

  stopwatchAmount: number = null;
  currentHourAmount: number = null;
  currentDayAmount: number = null;
  currentWeekAmount: number = null;
  currentMonthAmount: number = null;
  currentYearAmount: number = null;

  totalHourAmount: number = null;
  totalDayAmount: number = null;
  totalWeekAmount: number = null;
  totalMonthAmount: number = null;
  totalYearAmount: number = null;

  totalDayAmountWhenNotOff: number = null;
  totalHourAmountWhenNotOff: number = null;

  updateAmountsIntervalId: number = null;

  constructor(personNumber: number) {
    this.personNumber = personNumber;

    if (personNumber === 1) {
      this.name = AppConstants.Common.FIRST_USER_DEFAULT_NAME;
    }
    else {
      this.name = `Person ${personNumber}`;
    }

    this.weekWorkingDays = new Array<boolean>();
    this.weekWorkingDays[WeekDaysEnum.Sunday] = false;
    this.weekWorkingDays[WeekDaysEnum.Monday] = false;
    this.weekWorkingDays[WeekDaysEnum.Tuesday] = false;
    this.weekWorkingDays[WeekDaysEnum.Wednesday] = false;
    this.weekWorkingDays[WeekDaysEnum.Thursday] = false;
    this.weekWorkingDays[WeekDaysEnum.Friday] = false;
    this.weekWorkingDays[WeekDaysEnum.Saturday] = false;
  }

  private buildStartAndEndTimeDates(now: Date): void {
    this.dayStartTime = DateHelper.buildDate(now, this.startTime);
    this.dayEndTime = DateHelper.buildDate(now, this.endTime);

    if (this.endTime < this.startTime && this.endTime === "00:00") {
      this.dayStartTime = DateHelper.addMiliseconds(this.dayStartTime, -1);
      this.dayEndTime = DateHelper.getDateAtOneMilisecondBeforeEndOfDay(now);
    }
  }

  calculate(): void {

    this.dateTimeWhenClickedCalculate = new Date();
    let workingDaysArray = this.getWeekWorkingDaysArray();

    this.updateAmountsIntervalId = window.setInterval(() => {

      //This logic of now and dayStartTime, dayEndTime needs to be on the interval so if we pass to next day it still works
      let now: Date = new Date();
      this.buildStartAndEndTimeDates(now);

      this.hoursWorkedPerDay = DateHelper.hoursBetweenDates(this.dayStartTime, this.dayEndTime);

      this.workingDaysThisWeek = workingDaysArray.length;
      this.workingDaysThisMonth = DateHelper.getDaysWorkedInPeriod(workingDaysArray, DateHelper.getFirstDayOfCurrentMonth(now), DateHelper.getLastDayOfCurrentMonth(now));
      this.workingDaysThisYear = DateHelper.getDaysWorkedInPeriod(workingDaysArray, DateHelper.getFirstDayOfCurrentYear(now), DateHelper.getLastDayOfCurrentYear(now));

      this.workingHoursThisWeek = (this.workingDaysThisWeek * this.hoursWorkedPerDay);
      this.workingHoursThisMonth = (this.workingDaysThisMonth * this.hoursWorkedPerDay);
      this.workingHoursThisYear = (this.workingDaysThisYear * this.hoursWorkedPerDay);

      this.updateTotalAmounts(now);

      this.updateCurrentAmounts(now);

    }, AppConstants.Common.UPDATE_AMOUNTS_FREQUENCY_IN_MS);

  }

  private updateTotalAmounts(now: Date): void {



    switch (this.frequency.value) {
      //TODO Make Frequency values a Enum too.
      case "hour":
        this.totalDayAmountWhenNotOff = (+this.rate * this.hoursWorkedPerDay);
        this.totalHourAmountWhenNotOff = (this.hoursWorkedPerDay > 1 ? +this.rate : this.totalDayAmountWhenNotOff);

        this.totalDayAmount = (this.hasDayOff(now) ? 0 : this.totalDayAmountWhenNotOff);
        this.totalHourAmount = (!this.isWorkingAtSomePointDuringCurrentHour(now) ? 0 : this.totalHourAmountWhenNotOff);
        this.totalWeekAmount = (+this.rate * this.workingHoursThisWeek);
        this.totalMonthAmount = (+this.rate * this.workingHoursThisMonth);
        this.totalYearAmount = (+this.rate * this.workingHoursThisYear);
        break;
      case "day":
        this.totalDayAmountWhenNotOff = +this.rate;
        this.totalHourAmountWhenNotOff = (this.hoursWorkedPerDay > 1 ? (+this.rate / this.hoursWorkedPerDay) : +this.rate);

        this.totalDayAmount = (this.hasDayOff(now) ? 0 : this.totalDayAmountWhenNotOff);
        this.totalHourAmount = (!this.isWorkingAtSomePointDuringCurrentHour(now) ? 0 : this.totalHourAmountWhenNotOff);
        this.totalWeekAmount = (+this.rate * this.workingDaysThisWeek);
        this.totalMonthAmount = (+this.rate * this.workingDaysThisMonth);
        this.totalYearAmount = (+this.rate * this.workingDaysThisYear);

        break;
      case "week":
        this.totalDayAmountWhenNotOff = (+this.rate / this.workingDaysThisWeek);
        this.totalHourAmountWhenNotOff = (this.workingHoursThisWeek > 1 ? (this.totalDayAmountWhenNotOff / this.hoursWorkedPerDay) : +this.rate);

        this.totalDayAmount = (this.hasDayOff(now) ? 0 : this.totalDayAmountWhenNotOff);
        this.totalHourAmount = (!this.isWorkingAtSomePointDuringCurrentHour(now) ? 0 : this.totalHourAmountWhenNotOff);
        this.totalWeekAmount = +this.rate;
        this.totalMonthAmount = (this.totalDayAmountWhenNotOff * this.workingDaysThisMonth);
        this.totalYearAmount = (this.totalDayAmountWhenNotOff * this.workingDaysThisYear);
        break;
      case "month":
        this.totalMonthAmount = +this.rate;
        this.totalYearAmount = (+this.rate * 12);

        this.totalDayAmountWhenNotOff = (this.totalMonthAmount / this.workingDaysThisMonth);
        this.totalHourAmountWhenNotOff = (this.workingHoursThisMonth > 1 ? (this.totalDayAmountWhenNotOff / this.hoursWorkedPerDay) : +this.rate);

        this.totalDayAmount = (this.hasDayOff(now) ? 0 : this.totalDayAmountWhenNotOff);
        this.totalHourAmount = (!this.isWorkingAtSomePointDuringCurrentHour(now) ? 0 : this.totalHourAmountWhenNotOff);
        this.totalWeekAmount = (this.workingDaysThisWeek * this.totalDayAmountWhenNotOff);
        break;
      case "year":
        this.totalYearAmount = +this.rate;
        this.totalMonthAmount = (+this.rate / 12);

        this.totalDayAmountWhenNotOff = (this.totalMonthAmount / this.workingDaysThisMonth);
        this.totalHourAmountWhenNotOff = (this.workingHoursThisYear > 1 ? (this.totalDayAmountWhenNotOff / this.hoursWorkedPerDay) : +this.rate);

        this.totalDayAmount = (this.hasDayOff(now) ? 0 : this.totalDayAmountWhenNotOff);
        this.totalHourAmount = (!this.isWorkingAtSomePointDuringCurrentHour(now) ? 0 : this.totalHourAmountWhenNotOff);
        this.totalWeekAmount = (this.workingDaysThisWeek * this.totalDayAmountWhenNotOff);
        break;
    }
  }

  private updateCurrentAmounts(now: Date): void {
    this.updateStopwatchAmount(now);
    this.updateCurrentHourAmount(now);
    this.updateCurrentDayAmount(now);
    this.updateCurrentWeekAmount(now);
    this.updateCurrentMonthAmount(now);
    this.updateCurrentYearAmount(now);
  }

  private updateStopwatchAmount(now) {

    let hoursWorkedSinceClickedCalculate = 0;
    if (!this.hasDayOff(now) && this.workTodayHasStarted() && (this.dateTimeWhenClickedCalculate < this.dayEndTime)) {
      hoursWorkedSinceClickedCalculate = DateHelper.hoursBetweenDates(DateHelper.maxDate(this.dateTimeWhenClickedCalculate, this.dayStartTime), DateHelper.minDate(now, this.dayEndTime));
    }

    let earnedToday = (hoursWorkedSinceClickedCalculate * this.totalHourAmountWhenNotOff);

    this.stopwatchAmount = earnedToday;
  }
  private updateCurrentHourAmount(now) {

    this.currentHourAmount = this.getAmountEarnedThisHour(now);
  }

  private updateCurrentDayAmount(now: Date): void {

    this.currentDayAmount = this.getAmountEarnedToday(now);
  }

  private updateCurrentWeekAmount(now: Date): void {

    let startPeriod = DateHelper.getMondayOfCurrentWeek(now);
    startPeriod.setHours(0, 0, 0, 0);

    let earnedUntilYesterday = this.getAmountEarnedUntilYesterday(PeriodEnum.CurrentWeek, startPeriod, now);

    let earnedToday = this.getAmountEarnedToday(now);

    this.currentWeekAmount = (earnedUntilYesterday + earnedToday);
  }

  private updateCurrentMonthAmount(now: Date): void {

    let startPeriod = DateHelper.getFirstDayOfCurrentMonth(now);

    let earnedUntilYesterday = this.getAmountEarnedUntilYesterday(PeriodEnum.CurrentMonth, startPeriod, now);

    let earnedToday = this.getAmountEarnedToday(now);

    this.currentMonthAmount = (earnedUntilYesterday + earnedToday);
  }

  private updateCurrentYearAmount(now: Date): void {

    let startPeriod = DateHelper.getFirstDayOfCurrentYear(now);

    let earnedUntilYesterday = this.getAmountEarnedUntilYesterday(PeriodEnum.CurrentYear, startPeriod, now);

    let earnedToday = this.getAmountEarnedToday(now);

    this.currentYearAmount = (earnedUntilYesterday + earnedToday);;
  }

  private isWorkingAtSomePointDuringCurrentHour(now: Date): boolean {

    return !this.hasDayOff(now)
      && this.dayStartTime.getHours() <= now.getHours()
      && DateHelper.addMiliseconds(this.dayEndTime, -1).getHours() >= now.getHours();
  }

  private getAmountEarnedThisHour(now: Date): number {

    let earnedThisHour: number = 0;

    if (this.workTodayHasStarted() && this.isWorkingAtSomePointDuringCurrentHour(now)) {

      let currentHourStart: Date = new Date(now);
      let currentHourEnd: Date = new Date(now);

      const wasWorkingDuringPreviousHour = (this.dayStartTime.getHours() < now.getHours());

      const currentHourStartMinutes = (wasWorkingDuringPreviousHour ? 0 : this.dayStartTime.getMinutes());

      currentHourStart.setHours(now.getHours(), currentHourStartMinutes, 0, 0);

      const currentHourEndMinutes = (this.dayEndTime.getMinutes() > currentHourStartMinutes ? this.dayEndTime.getMinutes() : 0);

      if (currentHourEndMinutes === 0) {
        currentHourEnd.setHours(now.getHours() + 1, 0, 0, 0);
      }
      else {
        currentHourEnd.setHours(now.getHours(), currentHourEndMinutes, 0, 0);
      }

      const timeWorkedDuringCurrentHourInHours = DateHelper.hoursBetweenDates(currentHourStart, DateHelper.minDate(now, currentHourEnd));

      const totalTimeThatShouldWorkThisHourInHours = DateHelper.hoursBetweenDates(currentHourStart, currentHourEnd);

      const percentageCompleted = (timeWorkedDuringCurrentHourInHours / totalTimeThatShouldWorkThisHourInHours * 100);

      earnedThisHour = percentageCompleted * this.totalHourAmountWhenNotOff / 100;

    }

    return earnedThisHour;
  }

  private getAmountEarnedToday(now: Date): number {
    //TODO this function is called many times and should be called only once on each interval.
    let earnedToday: number = 0;

    if (this.workTodayHasStarted()) {
      const hoursWorkedToday = this.getNumberOfHoursWorkedToday(now);
      const percentageCompleted = (hoursWorkedToday / this.hoursWorkedPerDay * 100);
      earnedToday = percentageCompleted * this.totalDayAmountWhenNotOff / 100;
    }

    return earnedToday;
  }

  private getAmountEarnedUntilYesterday(periodType: PeriodEnum, startPeriod: Date, now: Date): number {

    let result = 0;

    if (periodType === PeriodEnum.CurrentYear && (this.frequency.value === "year" || this.frequency.value === "month")) {
      let monthsWorkedInFull = now.getMonth(); //getMonth() is 0 index.
      let firstdayOfCurrentMonth = DateHelper.getFirstDayOfCurrentMonth(now);
      let daysWorkedThisMonthUntilYesterday = this.getNumberOfDaysWorkedUntilYesterday(PeriodEnum.CurrentMonth, firstdayOfCurrentMonth, now);

      result = ((monthsWorkedInFull * this.totalMonthAmount) + (daysWorkedThisMonthUntilYesterday * this.totalDayAmountWhenNotOff));
    }
    else {
      let daysWorkedUntilYesterday = this.getNumberOfDaysWorkedUntilYesterday(periodType, startPeriod, now);
      result = (daysWorkedUntilYesterday * this.totalDayAmountWhenNotOff);
    }

    return result;
  }

  private getNumberOfDaysWorkedUntilYesterday(periodType: PeriodEnum, startPeriod: Date, now: Date): number {

    let yesterday = DateHelper.addDays(now, - 1);
    yesterday.setHours(0, 0, 0, 0);

    let result: number = 0;

    switch (periodType) {
      case PeriodEnum.Stopwatch:
      case PeriodEnum.CurrentHour:
      case PeriodEnum.CurrentDay:
        result = 0;
        break;
      case PeriodEnum.CurrentWeek:
        if (!DateHelper.isMonday(now)) {
          result = DateHelper.getDaysWorkedInPeriod(this.getWeekWorkingDaysArray(), startPeriod, yesterday);
        }
        break;
      case PeriodEnum.CurrentMonth:
        if (!DateHelper.isFirstDayOfTheMonth(now)) {
          result = DateHelper.getDaysWorkedInPeriod(this.getWeekWorkingDaysArray(), startPeriod, yesterday);
        }
        break;
      case PeriodEnum.CurrentYear:
        if (!DateHelper.isFirstDayOfTheYear(now)) {
          result = DateHelper.getDaysWorkedInPeriod(this.getWeekWorkingDaysArray(), startPeriod, yesterday);
        }
        break;

    }

    return result;

  }

  private getNumberOfHoursWorkedToday(now: Date): number {

    let hoursWorkedToday: number = 0;

    if (!this.hasDayOff(now) && this.workTodayHasStarted()) {
      hoursWorkedToday = DateHelper.hoursBetweenDates(this.dayStartTime, DateHelper.minDate(now, this.dayEndTime));
    }

    return hoursWorkedToday;

  }

  hasDayOff(date: Date = null): boolean {
    if (!date) {
      date = new Date();
    }
    return !includes(this.getWeekWorkingDaysArray(), date.getDay());
  }

  private getWeekWorkingDaysArray(): Array<number> {
    //TODO refactor this, we have 2 arrays... Also this method is called many times (from isOff etc.)
    //Also understand how reduce is working
    let result = this.weekWorkingDays.reduce((a, e, i) => {
      if (e)
        a.push(i);
      return a;
    }, []);

    return result;
  }

  canCalculate(): boolean {
    return (this.hasName()
      && this.hasRate()
      && this.currencySymbol
      && this.frequency
      && this.isAtLeastOneDayOfTheWeekSelected()
      && this.areStartAndEndTimesValid());
  }

  hasName(): boolean {
    return this.name && this.name.trim() !== "";
  }

  hasRate(): boolean {
    return this.rate && this.rate > 0;
  }

  isAtLeastOneDayOfTheWeekSelected(): boolean {
    return this.weekWorkingDays.some(wwd => { return wwd === true; });
  }

  areStartAndEndTimesValid(): boolean {
    return this.startTime && this.endTime &&
      ((this.endTime > this.startTime) || (this.endTime < this.startTime && this.endTime === "00:00"));
  }

  getRemainingTimeToStartWork(): string {
    //TODO this method is called many times, naybe do some calculations onCalculate event and store it as property instead
    //of calculating each single time.

    let now = new Date();

    if (!this.hasDayOff() && !this.workTodayHasStarted()) {
      return `You start work in ${DateHelper.getFormattedTimeBetweenDatesVerbose(now, this.dayStartTime)}`;
    }
    else if ((!this.hasDayOff() && this.workTodayHasFinished()) || this.hasDayOff()) {

      let tomorrow = DateHelper.addDays(now, 1);
      let nextWorkingDayStartTime = this.getNextWorkingDay(now);
      let nextWorkingDayName = WeekDaysEnum[nextWorkingDayStartTime.getDay()];

      if (this.hasDayOff(tomorrow)) {
        return `You're off until next ${nextWorkingDayName} at ${this.startTime}`;
      }
      else {

        const secondsUntilStartWorking = DateHelper.secondsBetweenDates(now, nextWorkingDayStartTime);
        const oneFullDayInSeconds = (24 * 60 * 60);

        if (secondsUntilStartWorking > oneFullDayInSeconds) {
          return `You start work tomorrow at ${this.startTime}`;
        }
        else {
          return `You start work in ${DateHelper.getFormattedTimeBetweenDatesVerbose(now, nextWorkingDayStartTime)}`;
        }

      }

    }
    else {
      //Should not ever reach this point
      return "";
    }

  }

  private getNextWorkingDay(date: Date): Date {
    let dayOfTheWeek = this.weekWorkingDays.indexOf(true, (date.getDay() + 1));
    if (dayOfTheWeek === -1) {
      dayOfTheWeek = this.weekWorkingDays.indexOf(true, 0);
    }

    let resultDate = DateHelper.getNextDayOfWeek(date, dayOfTheWeek);

    return DateHelper.buildDate(resultDate, this.startTime);
  }

  getRemainingTimeToFinishWork(): string {
    return DateHelper.getFormattedTimeBetweenDatesVerbose(new Date(), this.dayEndTime);
  }

  workTodayHasStarted(): boolean {
    let now = new Date();
    return (!this.hasDayOff(now) && (now > this.dayStartTime));
  }

  workTodayHasFinished(): boolean {
    let now = new Date();
    return (!this.hasDayOff(now) && (now > this.dayEndTime));
  }

  isCurrentlyWorking(): boolean {
    let now = new Date();
    return !this.hasDayOff(now) && this.workTodayHasStarted() && !this.workTodayHasFinished();
  }

  setDefaultValues(): void {

    this.startTime = "09:00";
    this.endTime = "17:00";
    this.currencySymbol = AppConstants.Common.CURRENCY_SYMBOLS[0];
    this.frequency = AppConstants.Common.FREQUENCIES[3];

    this.weekWorkingDays = new Array<boolean>();
    this.weekWorkingDays[WeekDaysEnum.Sunday] = false;
    this.weekWorkingDays[WeekDaysEnum.Monday] = true;
    this.weekWorkingDays[WeekDaysEnum.Tuesday] = true;
    this.weekWorkingDays[WeekDaysEnum.Wednesday] = true;
    this.weekWorkingDays[WeekDaysEnum.Thursday] = true;
    this.weekWorkingDays[WeekDaysEnum.Friday] = true;
    this.weekWorkingDays[WeekDaysEnum.Saturday] = false;
  }

  clearResults(): void {
    this.clearInterval();

    this.stopwatchAmount = null;
    this.currentHourAmount = null;
    this.currentDayAmount = null;
    this.currentWeekAmount = null;
    this.currentMonthAmount = null;
    this.currentYearAmount = null;

    this.totalHourAmount = null;
    this.totalDayAmount = null;
    this.totalWeekAmount = null;
    this.totalMonthAmount = null;
    this.totalYearAmount = null;
  }

  private clearInterval(): void {
    if (this.updateAmountsIntervalId) {
      console.log("INTERVAL CLEARED: " + this.name);
      clearInterval(this.updateAmountsIntervalId);
      this.updateAmountsIntervalId = null;
    }
  }
}
