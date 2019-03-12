
import * as moment from 'moment';
import { AppConstants } from '../constants/app-constants';
import { INameValue } from '../intefaces/name-value.interface';
import { WeekDaysEnum } from '../enums/week-days.enum';
import { DateHelper } from '../helpers/date-helper';

export class UserSelection  {
  personNumber: number = null;
  name: string = null;
  rate: number = null;
  startTime: string = null;
  endTime: string = null;
  currencySymbol: string = null;
  frequency: INameValue = null;
  weekWorkingDays: boolean[];

  startFullDate: Date;
  endFullDate: Date;

  currentAmount: number = null;

  fullPeriodRateInPennies: number = null;
  amountEarnedPerMilisecond: number = null;

  updateCurrentAmountIntervalId: number = null;

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

    this.buildFullDates();

    let rateInPennies: number = (this.rate * 100);

    switch (this.frequency.value) {
      case "day":
        this.fullPeriodRateInPennies = rateInPennies;
        break
      case "hour":
        let hoursOfWork: number = DateHelper.hoursBetweenDates(this.startFullDate, this.endFullDate);
        this.fullPeriodRateInPennies = (rateInPennies * hoursOfWork);
        break;
    }

    this.amountEarnedPerMilisecond = (this.fullPeriodRateInPennies / DateHelper.milisecondsBetweenDates(this.startFullDate, this.endFullDate));

    this.updateCurrentAmountIntervalId = window.setInterval(() => {
      this.updateCurrentAmount();
    }, AppConstants.Common.UPDATE_AMOUNT_FREQUENCY_IN_MS);

    console.log(this);
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
    let startWork = moment(this.startFullDate);
    return now.to(startWork, true);
  }

  getRemainingTimeToFinishWork(): string {
    let now = moment(new Date());
    let endWork = moment(this.endFullDate);
    return now.to(endWork, true);
  }

  updateCurrentAmount(): void {

    let now = new Date();
    let fullPeriodRate = (this.fullPeriodRateInPennies / 100);

    if (!this.workHasStarted()) {
      this.currentAmount = 0;
      return;
    }
    else if (this.workHasFinished()) {
      this.currentAmount = fullPeriodRate;
      this.clearUpdateCurrentAmountInterval();
      return;
    }

    let milisecondsFromStart = DateHelper.milisecondsBetweenDates(this.startFullDate, now);

    let currentAmount = ((milisecondsFromStart * this.amountEarnedPerMilisecond) / 100);

    this.currentAmount = Math.min(fullPeriodRate, currentAmount);

  }

  workHasStarted(): boolean {
    let now = new Date();
    return (now > this.startFullDate);
  }

  workHasFinished(): boolean {
    let now = new Date();
    return (now > this.endFullDate);
  }

  private buildFullDates(): void {
    let now: Date = new Date();
    this.startFullDate = DateHelper.buildDate(now, this.startTime);
    this.endFullDate = DateHelper.buildDate(now, this.endTime);
  }

  setDefaultValues(): void {
    
    this.rate = null;
    this.startTime = "09:00";
    this.endTime = "17:00";
    this.currencySymbol = AppConstants.Common.CURRENCY_SYMBOLS[0];
    this.frequency = AppConstants.Common.FREQUENCIES[0];

    this.weekWorkingDays = new Array<boolean>();
    this.weekWorkingDays[WeekDaysEnum.Sunday] = false;
    this.weekWorkingDays[WeekDaysEnum.Monday] = true;
    this.weekWorkingDays[WeekDaysEnum.Tuesday] = true;
    this.weekWorkingDays[WeekDaysEnum.Wednesday] = true;
    this.weekWorkingDays[WeekDaysEnum.Thursday] = true;
    this.weekWorkingDays[WeekDaysEnum.Friday] = true;
    this.weekWorkingDays[WeekDaysEnum.Saturday] = false;

    this.startFullDate = null;
    this.endFullDate = null;

    this.currentAmount = null;

    this.fullPeriodRateInPennies = null;
    this.amountEarnedPerMilisecond = null;
  }

  clearUpdateCurrentAmountInterval(): void {
    if (this.updateCurrentAmountIntervalId) {
      console.log("INTERVAL CLEARED: " + this.name);
      clearInterval(this.updateCurrentAmountIntervalId);
      this.updateCurrentAmountIntervalId = null;
    }
  }
}
