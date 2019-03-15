
import * as moment from 'moment';
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

  dayStartTime: Date;
  dayEndTime: Date;

  hoursWorkedPerDay: number = null;
  workingHoursThisWeek: number = null;
  workingHoursThisMonth: number = null;
  workingHoursThisYear: number = null;

  amountEarnedPerHour: number = null;

  sinceClickedAmount: number = null;
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
    this.name = `Person ${personNumber}`;

    this.weekWorkingDays = new Array<boolean>();
    this.weekWorkingDays[WeekDaysEnum.Sunday] = false;
    this.weekWorkingDays[WeekDaysEnum.Monday] = false;
    this.weekWorkingDays[WeekDaysEnum.Tuesday] = false;
    this.weekWorkingDays[WeekDaysEnum.Wednesday] = false;
    this.weekWorkingDays[WeekDaysEnum.Thursday] = false;
    this.weekWorkingDays[WeekDaysEnum.Friday] = false;
    this.weekWorkingDays[WeekDaysEnum.Saturday] = false;
  }

  calculate(): void {

    let workingDaysArray = this.getWeekWorkingDaysArray();

    this.updateAmountsIntervalId = window.setInterval(() => {

      //This logic of now and dayStartTime, dayEndTime needs to be on the interval so if we pass to next day it still works
      let now: Date = new Date();
      this.dayStartTime = DateHelper.buildDate(now, this.startTime);
      this.dayEndTime = DateHelper.buildDate(now, this.endTime);

      this.hoursWorkedPerDay = DateHelper.hoursBetweenDates(this.dayStartTime, this.dayEndTime);

      let workingDaysThisWeek = workingDaysArray.length;
      let workingDaysThisMonth = DateHelper.getDaysWorkedInPeriod(workingDaysArray, DateHelper.getFirstDayOfCurrentMonth(now), DateHelper.getLastDayOfCurrentMonth(now));
      let workingDaysThisYear = DateHelper.getDaysWorkedInPeriod(workingDaysArray, DateHelper.getFirstDayOfCurrentYear(now), DateHelper.getLastDayOfCurrentYear(now));

      this.workingHoursThisWeek = (workingDaysThisWeek * this.hoursWorkedPerDay);
      this.workingHoursThisMonth = (workingDaysThisMonth * this.hoursWorkedPerDay);
      this.workingHoursThisYear = (workingDaysThisYear * this.hoursWorkedPerDay);

      console.log("dayStartTime", this.dayStartTime);
      console.log("dayEndTime", this.dayEndTime);
      console.log({ workingDaysArray });
      console.log("hoursWorkedPerDay", this.hoursWorkedPerDay);
      console.log({ workingDaysThisWeek });
      console.log({ workingDaysThisMonth });
      console.log({ workingDaysThisYear });


      this.calculateAmountEarnedPerHour();

      console.log("amountEarnedPerHour", this.amountEarnedPerHour);

      this.updateTotalAmounts();

      console.log("totalDayAmount", this.totalDayAmount);
      console.log("totalWeekAmount", this.totalWeekAmount);
      console.log("totalMonthAmount", this.totalMonthAmount);
      console.log("totalYearAmount", this.totalYearAmount );

      this.updateCurrentDayAmount(now);
      this.updateCurrentWeekAmount(now);
      this.updateCurrentMonthAmount(now);
      this.updateCurrentYearAmount(now);

    }, AppConstants.Common.UPDATE_AMOUNTS_FREQUENCY_IN_MS);

    console.log(this);
  }

  private updateTotalAmounts(): void {
    this.totalHourAmount = 0; //TODO
    this.totalDayAmount = (this.amountEarnedPerHour * this.hoursWorkedPerDay);
    this.totalWeekAmount = (this.amountEarnedPerHour * this.workingHoursThisWeek);
    this.totalMonthAmount = (this.amountEarnedPerHour * this.workingHoursThisMonth);
    this.totalYearAmount = (this.amountEarnedPerHour * this.workingHoursThisYear);
  }

  private calculateAmountEarnedPerHour(): void {

    switch (this.frequency.value) {
      //TODO Make Frequency values a Enum too.
      case "hour":
        this.amountEarnedPerHour = this.rate;
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
      case PeriodEnum.CurrentDay:
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

    if (!this.isOff(now) && this.workHasStarted()) {
      //TODO Sin valor absoluto. valor tiene que ser mayor que 0, sino nada.
      console.log("DATEEEEEE", DateHelper.minDate(now, this.dayEndTime));
      hoursWorkedToday = DateHelper.hoursBetweenDates(this.dayStartTime, DateHelper.minDate(now, this.dayEndTime)); 
    }

    let totalHoursWorked = (hoursWorkedFromStartOfPeriodExcludingToday + hoursWorkedToday);

    let periodAmount = (totalHoursWorked * this.amountEarnedPerHour);

    return periodAmount;
  }

  private isOff(date: Date = null): boolean {
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
    return (this.name
      && this.rate && this.rate > 0
      && this.currencySymbol
      && this.frequency
      && this.startTime && this.endTime
      && (this.endTime > this.startTime));
  }

  getRemainingTimeToStartWork(): string {
    let now = moment(new Date());
    let startWork = moment(this.dayStartTime);
    return now.to(startWork, true);
  }

  getRemainingTimeToFinishWork(): string {
    let now = moment(new Date());
    let endWork = moment(this.dayEndTime);
    return now.to(endWork, true);
  }

  workHasStarted(): boolean {
    let now = new Date();
    return (!this.isOff(now) && now > this.dayStartTime);
  }

  workHasFinished(): boolean {
    let now = new Date();
    return (!this.isOff(now) && now > this.dayEndTime);
  }

  isCurrentlyWorking(): boolean {
    let now = new Date();
    return !this.isOff(now) && this.workHasStarted() && !this.workHasFinished();
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

  clearUpdateCurrentAmountInterval(): void {
    if (this.updateAmountsIntervalId) {
      console.log("INTERVAL CLEARED: " + this.name);
      clearInterval(this.updateAmountsIntervalId);
      this.updateAmountsIntervalId = null;
    }
  }
}
