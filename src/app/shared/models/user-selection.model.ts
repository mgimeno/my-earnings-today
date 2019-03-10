
import * as moment from 'moment';
import { Helpers } from '../helpers/date-helper';
import { AppConstants } from '../constants/app-constants';
import { INameValue } from '../intefaces/name-value.interface';

export class UserSelection  {
  rate: number;
  startTime: string;
  endTime: string;
  currencySymbol: string;
  frequency: INameValue;

  startFullDate: Date;
  endFullDate: Date;

  currentAmount: number;

  fullPeriodRateInPennies: number = null;
  amountEarnedPerMilisecond: number = null;

  updateCurrentAmountIntervalId: number = null;

  constructor() {
    this.setDefaultValues();
  }

  calculate(): void {

    this.buildFullDates();

    let rateInPennies: number = (this.rate * 100);

    switch (this.frequency.value) {
      case "day":
        this.fullPeriodRateInPennies = rateInPennies;
        break
      case "hour":
        let hoursOfWork: number = Helpers.DateHelper.hoursBetweenDates(this.startFullDate, this.endFullDate);
        this.fullPeriodRateInPennies = (rateInPennies * hoursOfWork);
        break;
    }

    this.amountEarnedPerMilisecond = (this.fullPeriodRateInPennies / Helpers.DateHelper.milisecondsBetweenDates(this.startFullDate, this.endFullDate));

    this.updateCurrentAmountIntervalId = window.setInterval(() => {
      this.updateCurrentAmount();
    }, AppConstants.Common.UPDATE_AMOUNT_FREQUENCY_IN_MS);

    console.log(this);
  }

  canCalculate(): boolean {
    return (this.rate && this.rate > 0
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

    let milisecondsFromStart = Helpers.DateHelper.milisecondsBetweenDates(this.startFullDate, now);

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
    this.startFullDate = Helpers.DateHelper.buildDate(now, this.startTime);
    this.endFullDate = Helpers.DateHelper.buildDate(now, this.endTime);
  }

  getCurrencyPipeDigitsInfo(): string {
    return Number.isInteger(this.currentAmount) ? "1.0" : "1.2";
  }

  setDefaultValues(): void {
    this.rate = null;
    this.startTime = "09:00";
    this.endTime = "17:00";
    this.startFullDate = null;
    this.endFullDate = null;

    this.currencySymbol = AppConstants.Common.CURRENCY_SYMBOLS[0];
    this.frequency = AppConstants.Common.FREQUENCIES[0];

    this.currentAmount = null;

    this.fullPeriodRateInPennies = null;
    this.amountEarnedPerMilisecond = null;
  }

  clearUpdateCurrentAmountInterval(): void {
    if (this.updateCurrentAmountIntervalId) {
      console.log("INTERVAL CLEARED");
      clearInterval(this.updateCurrentAmountIntervalId);
      this.updateCurrentAmountIntervalId = null;
    }
  }
}
