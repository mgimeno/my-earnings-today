import { includes } from 'lodash';
import { AppConstants } from '../constants/app.constant';
import { INameValue } from '../intefaces/name-value.interface';
import { WeekDaysEnum } from '../enums/week-days.enum';
import { DateHelper } from '../helpers/date-helper';
import { PeriodEnum } from '../enums/period.enum';
import { TranslationHelper } from '../helpers/translation-helper';

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

  workingHoursToday: number = null;
  workingHoursThisHour: number = null;
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
      this.name = `${$localize`:@@user-selection-model.person:Person`} ${personNumber}`;
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
    const workingDaysArray = this.getWeekWorkingDaysArray();

    this.updateAmountsIntervalId = window.setInterval(() => {

      //This logic of now and dayStartTime, dayEndTime needs to be on the interval so if we pass to next day it still works
      const now: Date = new Date();
      this.buildStartAndEndTimeDates(now);

      this.workingHoursToday = DateHelper.hoursBetweenDates(this.dayStartTime, this.dayEndTime);

      this.workingHoursThisHour = this.getWorkingHoursThisHour(now);

      this.workingDaysThisWeek = workingDaysArray.length;
      this.workingDaysThisMonth = DateHelper.getDaysWorkedInPeriod(workingDaysArray, DateHelper.getFirstDayOfCurrentMonth(now), DateHelper.getLastDayOfCurrentMonth(now));
      this.workingDaysThisYear = DateHelper.getDaysWorkedInPeriod(workingDaysArray, DateHelper.getFirstDayOfCurrentYear(now), DateHelper.getLastDayOfCurrentYear(now));

      this.workingHoursThisWeek = (this.workingDaysThisWeek * this.workingHoursToday);
      this.workingHoursThisMonth = (this.workingDaysThisMonth * this.workingHoursToday);
      this.workingHoursThisYear = (this.workingDaysThisYear * this.workingHoursToday);

      this.updateTotalAmounts(now);

      this.updateCurrentAmounts(now);

    }, AppConstants.Common.UPDATE_AMOUNTS_FREQUENCY_IN_MS);

  }

  private getWorkingHoursThisHour(now: Date): number {
    if (this.hasDayOff(now) || !this.isWorkingAtSomePointDuringCurrentHour(now)) {
      return 0;
    }

    const currentHourStartAndEndDates = this.getCurrentHourStartAndEndDates(now);

    return DateHelper.hoursBetweenDates(currentHourStartAndEndDates.start, currentHourStartAndEndDates.end);
  }


  private getTotalHourAmount(now: Date, hoursPercentage: number): number {

    if (this.frequency.value === "hour") {
      return (hoursPercentage * this.totalHourAmountWhenNotOff / 100);
    }
    else {

      if (!this.isWorkingAtSomePointDuringCurrentHour(now)) {
        return 0;
      }
      else if (this.workingHoursToday < 1 && (this.dayStartTime.getHours() === DateHelper.addMiliseconds(this.dayEndTime, -1).getHours())) {
        return this.totalDayAmountWhenNotOff;
      }
      else {
        return (hoursPercentage * this.totalHourAmountWhenNotOff / 100);
      }

    }
  }

  private updateTotalAmounts(now: Date): void {

    //todo rename this, also put in on this. variable so I don't need to always pass it as parameter
    const hoursPercentage = this.workingHoursThisHour / 1 * 100;

    switch (this.frequency.value) {
      //TODO Make Frequency values a Enum too.
      case "hour":
        this.totalDayAmountWhenNotOff = +this.rate * this.workingHoursToday;
        this.totalHourAmountWhenNotOff = +this.rate;

        this.totalHourAmount = this.getTotalHourAmount(now, hoursPercentage);

        this.totalDayAmount = (this.hasDayOff(now) ? 0 : this.totalDayAmountWhenNotOff);
        this.totalWeekAmount = (+this.rate * this.workingHoursThisWeek);
        this.totalMonthAmount = (+this.rate * this.workingHoursThisMonth);
        this.totalYearAmount = (+this.rate * this.workingHoursThisYear);
        break;
      case "day":
        this.totalDayAmountWhenNotOff = +this.rate;
        this.totalHourAmountWhenNotOff = (this.workingHoursToday > 1 ? (this.totalDayAmountWhenNotOff / this.workingHoursToday) : (this.totalDayAmountWhenNotOff * this.workingHoursToday));

        this.totalHourAmount = this.getTotalHourAmount(now, hoursPercentage);

        this.totalDayAmount = (this.hasDayOff(now) ? 0 : this.totalDayAmountWhenNotOff);
        this.totalWeekAmount = (+this.rate * this.workingDaysThisWeek);
        this.totalMonthAmount = (+this.rate * this.workingDaysThisMonth);
        this.totalYearAmount = (+this.rate * this.workingDaysThisYear);

        break;
      case "week":
        this.totalDayAmountWhenNotOff = (+this.rate / this.workingDaysThisWeek);
        this.totalHourAmountWhenNotOff = (this.workingHoursToday > 1 ? (this.totalDayAmountWhenNotOff / this.workingHoursToday) : (this.totalDayAmountWhenNotOff * this.workingHoursToday));

        this.totalHourAmount = this.getTotalHourAmount(now, hoursPercentage);

        this.totalDayAmount = (this.hasDayOff(now) ? 0 : this.totalDayAmountWhenNotOff);
        this.totalWeekAmount = +this.rate;
        this.totalMonthAmount = (this.totalDayAmountWhenNotOff * this.workingDaysThisMonth);
        this.totalYearAmount = (this.totalDayAmountWhenNotOff * this.workingDaysThisYear);
        break;
      case "month":
        this.totalMonthAmount = +this.rate;
        this.totalYearAmount = (+this.rate * 12);

        this.totalDayAmountWhenNotOff = (this.totalMonthAmount / this.workingDaysThisMonth);
        this.totalHourAmountWhenNotOff = (this.workingHoursToday > 1 ? (this.totalDayAmountWhenNotOff / this.workingHoursToday) : (this.totalDayAmountWhenNotOff * this.workingHoursToday));

        this.totalHourAmount = this.getTotalHourAmount(now, hoursPercentage);

        this.totalDayAmount = (this.hasDayOff(now) ? 0 : this.totalDayAmountWhenNotOff);
        this.totalWeekAmount = (this.workingDaysThisWeek * this.totalDayAmountWhenNotOff);
        break;
      case "year":
        this.totalYearAmount = +this.rate;
        this.totalMonthAmount = (+this.rate / 12);

        this.totalDayAmountWhenNotOff = (this.totalMonthAmount / this.workingDaysThisMonth);
        this.totalHourAmountWhenNotOff = (this.workingHoursToday > 1 ? (this.totalDayAmountWhenNotOff / this.workingHoursToday) : (this.totalDayAmountWhenNotOff * this.workingHoursToday));

        this.totalHourAmount = this.getTotalHourAmount(now, hoursPercentage);

        this.totalDayAmount = (this.hasDayOff(now) ? 0 : this.totalDayAmountWhenNotOff);
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

    const earnedToday = (hoursWorkedSinceClickedCalculate * this.totalHourAmountWhenNotOff);

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

    const earnedUntilYesterday = this.getAmountEarnedUntilYesterday(PeriodEnum.CurrentWeek, startPeriod, now);

    const earnedToday = this.getAmountEarnedToday(now);

    this.currentWeekAmount = (earnedUntilYesterday + earnedToday);
  }

  private updateCurrentMonthAmount(now: Date): void {

    const startPeriod = DateHelper.getFirstDayOfCurrentMonth(now);

    const earnedUntilYesterday = this.getAmountEarnedUntilYesterday(PeriodEnum.CurrentMonth, startPeriod, now);

    const earnedToday = this.getAmountEarnedToday(now);

    this.currentMonthAmount = (earnedUntilYesterday + earnedToday);
  }

  private updateCurrentYearAmount(now: Date): void {

    const startPeriod = DateHelper.getFirstDayOfCurrentYear(now);

    const earnedUntilYesterday = this.getAmountEarnedUntilYesterday(PeriodEnum.CurrentYear, startPeriod, now);

    const earnedToday = this.getAmountEarnedToday(now);

    this.currentYearAmount = (earnedUntilYesterday + earnedToday);;
  }

  private isWorkingAtSomePointDuringCurrentHour(now: Date): boolean {

    return !this.hasDayOff(now)
      && this.dayStartTime.getHours() <= now.getHours()
      && DateHelper.addMiliseconds(this.dayEndTime, -1).getHours() >= now.getHours();
  }

  private getCurrentHourStartAndEndDates(now): any {
    // todo don't return any, create object

    let start: Date = new Date(now);

    const currentHourStartMinutes = (this.dayStartTime.getHours() === now.getHours() ? this.dayStartTime.getMinutes() : 0);

    start.setHours(now.getHours(), currentHourStartMinutes, 0, 0);

    let end: Date = new Date(now);

    if (this.dayEndTime.getHours() === now.getHours()) {
      end.setHours(now.getHours(), this.dayEndTime.getMinutes(), 0, 0);

    }
    else {
      end.setHours(now.getHours() + 1, 0, 0, 0);
    }

    return {
      start,
      end
    };

  }

  private getAmountEarnedThisHour(now: Date): number {

    let earnedThisHour: number = 0;

    if (this.workTodayHasStarted() && this.isWorkingAtSomePointDuringCurrentHour(now)) {

      const currentHourStartAndEndDates = this.getCurrentHourStartAndEndDates(now);

      const timeWorkedDuringCurrentHourInHours = DateHelper.hoursBetweenDates(currentHourStartAndEndDates.start, DateHelper.minDate(now, currentHourStartAndEndDates.end));

      const totalTimeThatShouldWorkThisHourInHours = DateHelper.hoursBetweenDates(currentHourStartAndEndDates.start, currentHourStartAndEndDates.end);

      const percentageCompleted = (timeWorkedDuringCurrentHourInHours / totalTimeThatShouldWorkThisHourInHours * 100);

      earnedThisHour = percentageCompleted * this.totalHourAmount / 100;

    }

    return earnedThisHour;
  }

  private getAmountEarnedToday(now: Date): number {
    //TODO this function is called many times and should be called only once on each interval.
    let earnedToday: number = 0;

    if (this.workTodayHasStarted()) {
      const hoursWorkedToday = this.getNumberOfHoursWorkedToday(now);
      const percentageCompleted = (hoursWorkedToday / this.workingHoursToday * 100);
      earnedToday = percentageCompleted * this.totalDayAmountWhenNotOff / 100;
    }

    return earnedToday;
  }

  private getAmountEarnedUntilYesterday(periodType: PeriodEnum, startPeriod: Date, now: Date): number {

    let result = 0;

    if (periodType === PeriodEnum.CurrentYear && (this.frequency.value === "year" || this.frequency.value === "month")) {
      const monthsWorkedInFull = now.getMonth(); //getMonth() is 0 index.
      const firstdayOfCurrentMonth = DateHelper.getFirstDayOfCurrentMonth(now);
      const daysWorkedThisMonthUntilYesterday = this.getNumberOfDaysWorkedUntilYesterday(PeriodEnum.CurrentMonth, firstdayOfCurrentMonth, now);

      result = ((monthsWorkedInFull * this.totalMonthAmount) + (daysWorkedThisMonthUntilYesterday * this.totalDayAmountWhenNotOff));
    }
    else {
      const daysWorkedUntilYesterday = this.getNumberOfDaysWorkedUntilYesterday(periodType, startPeriod, now);
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
    return this.weekWorkingDays.reduce((a, e, i) => {
      if (e)
        a.push(i);
      return a;
    }, []);
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

    const now = new Date();

    if (!this.hasDayOff() && !this.workTodayHasStarted()) {
      return `${$localize`:@@user-selection-model.you-start-work-in:You start work in`} ${DateHelper.getFormattedTimeBetweenDatesVerbose(now, this.dayStartTime)}`;
    }
    else if ((!this.hasDayOff() && this.workTodayHasFinished()) || this.hasDayOff()) {

      const tomorrow = DateHelper.addDays(now, 1);
      const nextWorkingDayStartTime = this.getNextWorkingDay(now);
      const nextWorkingDayNumber = nextWorkingDayStartTime.getDay();
      const nextWorkingDayName = TranslationHelper.translateDayOfTheWeek(nextWorkingDayNumber);

      if (this.hasDayOff(tomorrow)) {
        return `${$localize`:@@user-selection-model.you-are-off-until-next:You're off until`} ${nextWorkingDayName} ${$localize`:@@user-selection-model.at:at`} ${this.startTime}`;
      }
      else {

        const secondsUntilStartWorking = DateHelper.secondsBetweenDates(now, nextWorkingDayStartTime);
        const oneFullDayInSeconds = (24 * 60 * 60);

        if (secondsUntilStartWorking > oneFullDayInSeconds) {
          return `${$localize`:@@user-selection-model.you-start-work-tomorrow-at:You start work tomorrow at`} ${this.startTime}`;
        }
        else {
          return `${$localize`:@@user-selection-model.you-start-work-in:You start work in`} ${DateHelper.getFormattedTimeBetweenDatesVerbose(now, nextWorkingDayStartTime)}`;
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

    const resultDate = DateHelper.getNextDayOfWeek(date, dayOfTheWeek);

    return DateHelper.buildDate(resultDate, this.startTime);
  }

  getRemainingTimeToFinishWork(): string {
    return DateHelper.getFormattedTimeBetweenDatesVerbose(new Date(), this.dayEndTime);
  }

  workTodayHasStarted(): boolean {
    const now = new Date();
    return (!this.hasDayOff(now) && (now > this.dayStartTime));
  }

  workTodayHasFinished(): boolean {
    const now = new Date();
    return (!this.hasDayOff(now) && (now > this.dayEndTime));
  }

  isCurrentlyWorking(): boolean {
    const now = new Date();
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
      clearInterval(this.updateAmountsIntervalId);
      this.updateAmountsIntervalId = null;
    }
  }
}
