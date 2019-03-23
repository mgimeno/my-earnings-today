//import * as moment from 'moment';
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
  workingHoursThisWeek: number = null;
  workingHoursThisMonth: number = null;
  workingHoursThisYear: number = null;

  amountEarnedPerHour: number = null;

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

  updateAmountsIntervalId: number = null;

  constructor(personNumber: number = null) {
    this.personNumber = personNumber;

    if (!personNumber || personNumber === 1) {
      this.name = AppConstants.Common.FIRST_USER_DEFAULT_NAME;
    }
    else if (personNumber > 1) {
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

      let workingDaysThisWeek = workingDaysArray.length;
      let workingDaysThisMonth = DateHelper.getDaysWorkedInPeriod(workingDaysArray, DateHelper.getFirstDayOfCurrentMonth(now), DateHelper.getLastDayOfCurrentMonth(now));
      let workingDaysThisYear = DateHelper.getDaysWorkedInPeriod(workingDaysArray, DateHelper.getFirstDayOfCurrentYear(now), DateHelper.getLastDayOfCurrentYear(now));

      this.workingHoursThisWeek = (workingDaysThisWeek * this.hoursWorkedPerDay);
      this.workingHoursThisMonth = (workingDaysThisMonth * this.hoursWorkedPerDay);
      this.workingHoursThisYear = (workingDaysThisYear * this.hoursWorkedPerDay);

      this.calculateAmountEarnedPerHour();

      this.updateTotalAmounts();

      this.updateStopwatchAmount(now);
      this.updateCurrentHourAmount(now);
      this.updateCurrentDayAmount(now);
      this.updateCurrentWeekAmount(now);
      this.updateCurrentMonthAmount(now);
      this.updateCurrentYearAmount(now);

    }, AppConstants.Common.UPDATE_AMOUNTS_FREQUENCY_IN_MS);

    console.log(this);
  }

  private updateTotalAmounts(): void {
    this.totalHourAmount = this.amountEarnedPerHour;
    this.totalDayAmount = (this.amountEarnedPerHour * this.hoursWorkedPerDay);
    this.totalWeekAmount = (this.amountEarnedPerHour * this.workingHoursThisWeek);
    this.totalMonthAmount = (this.amountEarnedPerHour * this.workingHoursThisMonth);
    this.totalYearAmount = (this.amountEarnedPerHour * this.workingHoursThisYear);
  }

  private calculateAmountEarnedPerHour(): void {

    switch (this.frequency.value) {
      //TODO Make Frequency values a Enum too.
      case "hour":
        this.amountEarnedPerHour = +this.rate;
        break;
      case "day":
        this.amountEarnedPerHour = (this.rate / this.hoursWorkedPerDay);
        break;
      case "week":
        this.amountEarnedPerHour = (this.rate / this.workingHoursThisWeek);
        break;
      case "month":
        this.amountEarnedPerHour = (this.rate / this.workingHoursThisMonth);
        break;
      case "year":
        this.amountEarnedPerHour = (this.rate / this.workingHoursThisYear);
        break;
    }
  }

  private updateStopwatchAmount(now) {
    let startPeriod = new Date(this.dateTimeWhenClickedCalculate);

    this.stopwatchAmount = this.getAmountEarnedByPeriodUntilNow(PeriodEnum.Stopwatch, startPeriod, now);
  }
  private updateCurrentHourAmount(now) {

    let startPeriod = new Date(now);

    this.currentHourAmount = this.getAmountEarnedByPeriodUntilNow(PeriodEnum.CurrentHour, startPeriod, now);
  }

  private updateCurrentDayAmount(now: Date): void {

    let startPeriod = new Date(now);
    startPeriod.setHours(0, 0, 0, 0);

    this.currentDayAmount = this.getAmountEarnedByPeriodUntilNow(PeriodEnum.CurrentDay, startPeriod, now);

  }

  private updateCurrentWeekAmount(now: Date): void {

    let startPeriod = DateHelper.getMondayOfCurrentWeek(now);
    startPeriod.setHours(0, 0, 0, 0);

    this.currentWeekAmount = this.getAmountEarnedByPeriodUntilNow(PeriodEnum.CurrentWeek, startPeriod, now);
  }

  private updateCurrentMonthAmount(now: Date): void {

    let startPeriod = DateHelper.getFirstDayOfCurrentMonth(now);

    this.currentMonthAmount = this.getAmountEarnedByPeriodUntilNow(PeriodEnum.CurrentMonth, startPeriod, now);
  }

  private updateCurrentYearAmount(now: Date): void {

    let startPeriod = DateHelper.getFirstDayOfCurrentYear(now);

    this.currentYearAmount = this.getAmountEarnedByPeriodUntilNow(PeriodEnum.CurrentYear, startPeriod, now);
  }

  private getAmountEarnedByPeriodUntilNow(periodType: PeriodEnum, startPeriod: Date, now: Date): number {

    let yesterday = DateHelper.addDays(now, - 1);
    yesterday.setHours(0, 0, 0, 0);

    let daysWorkedFromStartOfPeriodExcludingToday: number = 0;

    switch (periodType) {
      case PeriodEnum.Stopwatch:
        daysWorkedFromStartOfPeriodExcludingToday = DateHelper.getDaysWorkedInPeriod(this.getWeekWorkingDaysArray(), startPeriod, yesterday);
        break;
      case PeriodEnum.CurrentHour:
      case PeriodEnum.CurrentDay:
        daysWorkedFromStartOfPeriodExcludingToday = 0;
        break;
      case PeriodEnum.CurrentWeek:
        if (!DateHelper.isMonday(now)) {
          daysWorkedFromStartOfPeriodExcludingToday = DateHelper.getDaysWorkedInPeriod(this.getWeekWorkingDaysArray(), startPeriod, yesterday);
        }
        break;
      case PeriodEnum.CurrentMonth:
        if (!DateHelper.isFirstDayOfTheMonth(now)) {
          daysWorkedFromStartOfPeriodExcludingToday = DateHelper.getDaysWorkedInPeriod(this.getWeekWorkingDaysArray(), startPeriod, yesterday);
        }
        break;
      case PeriodEnum.CurrentYear:
        if (!DateHelper.isFirstDayOfTheYear(now)) {
          daysWorkedFromStartOfPeriodExcludingToday = DateHelper.getDaysWorkedInPeriod(this.getWeekWorkingDaysArray(), startPeriod, yesterday);
        }
        break;

    }

    let hoursWorkedFromStartOfPeriodExcludingToday = (daysWorkedFromStartOfPeriodExcludingToday * this.hoursWorkedPerDay);
    let hoursWorkedToday: number = 0;

    if (!this.hasDayOff(now) && this.workTodayHasStarted()) {

      if (periodType === PeriodEnum.CurrentHour) {
        let currentHourStart = new Date(now);
        currentHourStart.setMinutes(0, 0, 0);
        let currentHourEnd = new Date(now);
        currentHourEnd.setMinutes(59, 59, 999);
        console.log({ currentHourStart });
        console.log({ currentHourEnd });
        //TODO Sin valor absoluto. valor tiene que ser mayor que 0, sino nada.
        hoursWorkedToday = DateHelper.hoursBetweenDates(currentHourStart, DateHelper.minDate(now, currentHourEnd));
      }
      else if (periodType === PeriodEnum.Stopwatch) {
        //TODO Sin valor absoluto. valor tiene que ser mayor que 0, sino nada.
        hoursWorkedToday = DateHelper.hoursBetweenDates(this.dateTimeWhenClickedCalculate, DateHelper.minDate(now, this.dayEndTime));
      }
      else {
        //TODO Sin valor absoluto. valor tiene que ser mayor que 0, sino nada.
        hoursWorkedToday = DateHelper.hoursBetweenDates(this.dayStartTime, DateHelper.minDate(now, this.dayEndTime));
      }

    }

    let totalHoursWorked = (hoursWorkedFromStartOfPeriodExcludingToday + hoursWorkedToday);

    let periodAmount = (totalHoursWorked * this.amountEarnedPerHour);

    return periodAmount;
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
    //todo maybe use lodash _.isEmpty()
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
    //let now = new Date();
    //let nowMoment = moment(now);

    //if (!this.hasDayOff() && !this.workTodayHasStarted()) {
    //  let startTimeMoment = moment(this.dayStartTime);
    //  return `You start working in around ${nowMoment.to(startTimeMoment, true)}`;
    //}
    //else if (this.workTodayHasFinished() || this.hasDayOff()) {

    //  let tomorrow = DateHelper.addDays(now, 1);
    //  let nextWorkingDayStartTime = this.getNextWorkingDay(now);
    //  let nextWorkingDayName = WeekDaysEnum[nextWorkingDayStartTime.getDay()];

    //  if (this.hasDayOff(tomorrow)) {
    //    return `You are off until next ${nextWorkingDayName} at ${this.startTime}`;
    //  }
    //  else {
    //    let nextWorkingDayStartTimeMoment = moment(nextWorkingDayStartTime);
    //    return `You start working in around ${nowMoment.to(nextWorkingDayStartTimeMoment, true)}`;
    //  }

    //}
    //else {
    //  //Should not ever reach this point
    //  return "";
    //}


    let now = new Date();

    if (!this.hasDayOff() && !this.workTodayHasStarted()) {
      return `You start work in ${DateHelper.getFormattedTimeBetweenDatesVerbose(now, this.dayStartTime)}`;
    }
    else if (this.workTodayHasFinished() || this.hasDayOff()) {

      let tomorrow = DateHelper.addDays(now, 1);
      let nextWorkingDayStartTime = this.getNextWorkingDay(now);
      let nextWorkingDayName = WeekDaysEnum[nextWorkingDayStartTime.getDay()];

      if (this.hasDayOff(tomorrow)) {
        return `You're off until next ${nextWorkingDayName} at ${this.startTime}`;
      }
      else {
        return `You start work in ${DateHelper.getFormattedTimeBetweenDatesVerbose(now, nextWorkingDayStartTime)}`;
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
    //let now = moment(new Date());
    //let endWork = moment(this.dayEndTime);
    //return now.to(endWork, true);
    return DateHelper.getFormattedTimeBetweenDatesVerbose(new Date(), this.dayEndTime);
  }

  workTodayHasStarted(): boolean {
    let now = new Date();
    return (!this.hasDayOff(now) && now > this.dayStartTime);
  }

  workTodayHasFinished(): boolean {
    let now = new Date();
    return (!this.hasDayOff(now) && now > this.dayEndTime);
  }

  isCurrentlyWorking(): boolean {
    let now = new Date();
    return !this.hasDayOff(now) && this.workTodayHasStarted() && !this.workTodayHasFinished();
  }

  setDefaultValues(): void {

    this.startTime = "09:00";
    this.endTime = "17:00";
    this.currencySymbol = AppConstants.Common.CURRENCY_SYMBOLS[0];
    this.frequency = AppConstants.Common.FREQUENCIES[1];

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
