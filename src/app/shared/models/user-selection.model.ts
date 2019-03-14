
import * as moment from 'moment';
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
  amountEarnedPerHour: number = null;

  currentDayAmount: number = null;
  currentWeekAmount: number = null;
  currentMonthAmount: number = null;
  currentYearAmount: number = null;


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

    let now: Date = new Date();
    this.dayStartTime = DateHelper.buildDate(now, this.startTime);
    this.dayEndTime = DateHelper.buildDate(now, this.endTime);

    this.hoursWorkedPerDay = DateHelper.hoursBetweenDates(this.dayStartTime, this.dayEndTime);

    this.amountEarnedPerHour = -9999; //TODO CALCULATE THIS (Depending on Frequency)

    //TODO -> Calculate the TOTALS for all 4. (they depend on what kind of frequency they selected).
    this.totalDayAmount = this.rate;

    this.updateAmountsIntervalId = window.setInterval(() => {

      this.updateCurrentDayAmount();
      this.updateCurrentWeekAmount(now);
      this.updateCurrentMonthAmount(now);
      this.updateCurrentYearAmount(now);

    }, AppConstants.Common.UPDATE_AMOUNTS_FREQUENCY_IN_MS);

    console.log(this);
  }

   private updateCurrentDayAmount(): void {

     //TODO use new logic

     let rateInPennies = (this.rate * 100);
     let hoursOfWork: number = DateHelper.hoursBetweenDates(this.dayStartTime, this.dayEndTime);
     let fullPeriodRateInPennies = (rateInPennies * hoursOfWork);
     this.totalDayAmount = (fullPeriodRateInPennies / 100);

    let now = new Date();
    let fullPeriodRate = (fullPeriodRateInPennies / 100);

    if (!this.workHasStarted()) {
      this.currentDayAmount = 0;
      return;
    }
    else if (this.workHasFinished()) {
      this.currentDayAmount = fullPeriodRate;
      this.clearUpdateCurrentAmountInterval();
      return;
    }

    let milisecondsFromStart = DateHelper.milisecondsBetweenDates(this.dayStartTime, now);

    let currentAmount = ((milisecondsFromStart * this.amountEarnedPerMilisecond) / 100);

    this.currentDayAmount = Math.min(fullPeriodRate, currentAmount);

  }

  private updateCurrentWeekAmount(now: Date): void {

    let startPeriod = new Date(now.getFullYear(), 0, 1);
    let endPeriod = DateHelper.addDays(now, - 1);

    this.currentWeekAmount = this.getAmountEarnedByPeriod(PeriodEnum.CurrentWeek, startPeriod, endPeriod);
  }

  private updateCurrentMonthAmount(now: Date): void {

    let startPeriod = new Date(now.getFullYear(), now.getMonth(), 1);
    let endPeriod = DateHelper.addDays(now, - 1);

    this.currentMonthAmount = this.getAmountEarnedByPeriod(PeriodEnum.CurrentMonth, startPeriod, endPeriod);
  }

  private updateCurrentYearAmount(now: Date): void {

    let startPeriod = new Date(now.getFullYear(), 0, 1);
    let endPeriod = DateHelper.addDays(now, - 1);

    this.currentYearAmount = this.getAmountEarnedByPeriod(PeriodEnum.CurrentYear, startPeriod, endPeriod);
  }

  private getAmountEarnedByPeriod(periodType: PeriodEnum, startPeriod: Date, endPeriod: Date): number {

    let hoursWorkedFromStartOfPeriodUntilYesterday: number = null;

    switch (periodType) {
      case PeriodEnum.CurrentDay:
        hoursWorkedFromStartOfPeriodUntilYesterday = 0;
        break;
      case PeriodEnum.CurrentWeek:
      case PeriodEnum.CurrentMonth:
      case PeriodEnum.CurrentYear:
        //TODO, Esta logic para ver si se ha trabajado algo hasta ayer en el periodo seleccionado.
        //if (endPeriod.getDate() > startPeriod.getDate()) { //Today is not 1st of Jan
        //  hoursWorkedFromStartOfPeriodUntilYesterday = (DateHelper.getDaysWorkedInPeriod(workDays, startPeriod, endPeriod) * this.hoursWorkedPerDay);
        //}
        break;
    }

    if (endPeriod > startPeriod) { //Today is not 1st of Jan
      hoursWorkedFromStartOfPeriodUntilYesterday = (DateHelper.getDaysWorkedInPeriod(workDays, startPeriod, endPeriod) * this.hoursWorkedPerDay);
    }


    //check if today I worked, otherwise 0.
    let hoursWorkedToday = DateHelper.hoursBetweenDates(START_OF_SHIFT, NOW); // Sin valor absoluto. valor tiene que ser mayor que 0, sino nada.

    let totalHoursWorked = (hoursWorkedFromStartOfPeriodUntilYesterday + hoursWorkedToday);

    let periodAmount = (totalHoursWorked * this.amountEarnedPerHour);

    return periodAmount;
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
    return (now > this.dayStartTime);
  }

  workHasFinished(): boolean {
    let now = new Date();
    return (now > this.dayEndTime);
  }

  isCurrentlyWorking(): boolean {
    return this.workHasStarted() && !this.workHasFinished();
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
