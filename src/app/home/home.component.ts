import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NameValue } from '../intefaces/name-value.interface';
import { environment } from '../../environments/environment';
import { MatBottomSheet } from '@angular/material';
import { ShareBottomSheetComponent } from '../share-bottom-sheet/share-bottom-sheet.component';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, OnDestroy {

  showResults: boolean = false;

  currentAmount: number = null;

  startFullDate: Date = null;
  endFullDate: Date = null;

  updateCurrentAmountIntervalId: number = null;
  updateAmountFrequencyInMs: number = 100;

  rate: number = null;
  startTime: string = "09:00";
  endTime: string = "17:00";

  readonly currencySymbols: Array<string> = ["£", "$", "€", "‎₽", "CN¥", "C$", "₣", "₹", "kr", "￥", "zł", "R$", "₴", "₩", "฿", "₫", "₲", "₱", "₦", "₪", "₡", "৳"];
  currencySymbol: string = this.currencySymbols[0];

  readonly rateFrequencies: Array<NameValue> = [{ name: "Per day", value: "day" }, { name: "Per hour", value: "hour" }];
  rateFrequency: NameValue = this.rateFrequencies[0];

  fullPeriodRateInPennies: number = null;
  amountEarnedPerMilisecond: number = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private bottomSheet: MatBottomSheet) {

    if (this.hasUserSelectionOnURL()) {
      this.loadUserSelectionFromURL();
    }
    else if (this.hasUserSelectionOnLocalStorage()) {
      this.loadUserSelectionFromLocalStorage();
    }

    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        if (event.url === "/" && event.navigationTrigger === "imperative") {
          this.clearUpdateCurrentAmountInterval();
          this.showResults = false;
        }
      });

  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.clearUpdateCurrentAmountInterval();
  }



  canCalculate(): boolean {
    return (this.rate && this.rate > 0
      && this.currencySymbol
      && this.rateFrequency
      && this.startTime && this.endTime
      && (this.endTime > this.startTime));
  }

  calculate(): void {

    this.saveUserSelectionOnLocalStorage();
    this.setUserSelectionOnURL();

    let now: Date = new Date();
    this.startFullDate = this.buildDate(now, this.startTime);
    this.endFullDate = this.buildDate(now, this.endTime);

    let rateInPennies: number = (this.rate * 100);

    switch (this.rateFrequency.value) {
      case "day":
        this.fullPeriodRateInPennies = rateInPennies;
        break
      case "hour":
        let hoursOfWork: number = this.hoursBetweenDates(this.startFullDate, this.endFullDate);
        this.fullPeriodRateInPennies = (rateInPennies * hoursOfWork);
        break;
    }

    this.amountEarnedPerMilisecond = (this.fullPeriodRateInPennies / this.milisecondsBetweenDates(this.startFullDate, this.endFullDate));

    this.showResults = true;

    this.updateCurrentAmountIntervalId = window.setInterval(() => {
      this.updateCurrentAmount();
    }, this.updateAmountFrequencyInMs);

  }

  openShareBottomSheet(): void {
    this.bottomSheet.open(ShareBottomSheetComponent);
  }

  workHasStarted(): boolean {
    let now = new Date();
    return (now > this.startFullDate);
  }

  workFinished(): boolean {
    let now = new Date();
    return (now > this.endFullDate);
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

  private updateCurrentAmount(): void {

    let now = new Date();
    let fullPeriodRate = (this.fullPeriodRateInPennies / 100);

    if (!this.workHasStarted()) {
      this.currentAmount = 0;
      return;
    }
    else if (this.workFinished()) {
      this.currentAmount = fullPeriodRate;
      this.clearUpdateCurrentAmountInterval();
      return;
    }

    let milisecondsFromStart = this.milisecondsBetweenDates(this.startFullDate, now);

    let currentAmount = ((milisecondsFromStart * this.amountEarnedPerMilisecond) / 100);

    this.currentAmount = Math.min(fullPeriodRate, currentAmount);

  }

  private milisecondsBetweenDates(date1: Date, date2: Date): number {
    let diff = date1.getTime() - date2.getTime();

    return Math.abs(diff);
  }

  private hoursBetweenDates(date1: Date, date2: Date): number {
    return (this.milisecondsBetweenDates(date1, date2) / 1000 / 60 / 60);
  }

  private buildDate(date: Date, time: string): Date {
    let hours = +time.split(':')[0];
    let minutes = +time.split(':')[1];

    let result = new Date(date);
    result.setHours(hours, minutes, 0, 0);
    return result;
  }

  getCurrencyPipeDigitsInfo(amount: number): string {
    return Number.isInteger(amount) ? "1.0" : "1.2";
  }

  private isValidTime(text: string): boolean {
    let result = false;

    if (text.length === 5) {
      let hours = +text.substring(0, 2);
      let separator = text.substring(2, 3);
      let minutes = +text.substring(3, 5);

      if (separator === ":" && !isNaN(hours) && !isNaN(minutes)) {
        if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
          result = true;
        }
      }

    }

    return result;
  }

  private hasUserSelectionOnLocalStorage(): boolean {
    //TODO move localStorage stuff to a service or helper.
    let prefix = environment.localStoragePrefix;

    return (localStorage[`${prefix}rate`]
      && localStorage[`${prefix}frequency`]
      && localStorage[`${prefix}currency`]
      && localStorage[`${prefix}start`]
      && localStorage[`${prefix}end`]);
  }

  private loadUserSelectionFromLocalStorage(): void {
    let prefix = environment.localStoragePrefix;

    this.rate = localStorage[`${prefix}rate`];
    this.currencySymbol = localStorage[`${prefix}currency`];
    this.startTime = localStorage[`${prefix}start`];
    this.endTime = localStorage[`${prefix}end`];

    let indexOnArray = this.rateFrequencies.map(rf => rf.value).indexOf(localStorage[`${prefix}frequency`]);
    if (indexOnArray != -1) {
      this.rateFrequency = this.rateFrequencies[indexOnArray];
    }

  }

  private saveUserSelectionOnLocalStorage(): void {
    let prefix = environment.localStoragePrefix;

    localStorage[`${prefix}rate`] = this.rate;
    localStorage[`${prefix}frequency`] = this.rateFrequency.value;
    localStorage[`${prefix}currency`] = this.currencySymbol;
    localStorage[`${prefix}start`] = this.startTime;
    localStorage[`${prefix}end`] = this.endTime;
  }

  private hasUserSelectionOnURL(): boolean {
    let queryParams = this.activatedRoute.snapshot.queryParams;

    return (queryParams.rate
      && queryParams.frequency
      && queryParams.currency
      && queryParams.start
      && queryParams.end)
  }

  private loadUserSelectionFromURL(): void {

    let queryParams = this.activatedRoute.snapshot.queryParams;

    if (this.hasUserSelectionOnURL()) {

      this.rate = null;
      this.startTime = null;
      this.endTime = null;

      if (queryParams.rate && !isNaN(queryParams.rate) && queryParams.rate > 0) {
        this.rate = queryParams.rate;
      }
      if (queryParams.frequency) {
        let indexOnArray = this.rateFrequencies.map(rf => rf.value).indexOf(queryParams.frequency);
        if (indexOnArray != -1) {
          this.rateFrequency = this.rateFrequencies[indexOnArray];
        }
      }
      if (queryParams.currency) {
        let indexOnArray = this.currencySymbols.map(cs => cs).indexOf(queryParams.currency);
        if (indexOnArray != -1) {
          this.currencySymbol = queryParams.currency;
        }
      }
      if (queryParams.start) {
        if (this.isValidTime(queryParams.start)) {
          this.startTime = queryParams.start;
        }
      }
      if (queryParams.end) {
        if (this.isValidTime(queryParams.end)) {
          this.endTime = queryParams.end;
        }
      }

      if (this.canCalculate()) {
        this.calculate();
      }

    }
  }

  private setUserSelectionOnURL(): void {

    let params = {
      rate: this.rate,
      frequency: this.rateFrequency.value,
      currency: this.currencySymbol,
      start: this.startTime,
      end: this.endTime
    };

    this.router.navigate(['.'], { queryParams: params });
  }

  private clearUpdateCurrentAmountInterval(): void {
    if (this.updateCurrentAmountIntervalId) {
      clearInterval(this.updateCurrentAmountIntervalId);
      this.updateCurrentAmountIntervalId = null;
    }
  }
}
