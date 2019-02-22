import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Router, NavigationStart, Event } from '@angular/router';
import { Observable } from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';
import {
  Subject, asapScheduler, pipe, of, from,
  interval, merge, fromEvent
} from 'rxjs';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  showResults: boolean = false;

  currentAmount: number = null;


  dailyRate: number = null;

  startTime: string = "09:00";
  endTime: string = "17:00";

  startFullDate: Date = null;
  endFullDate: Date = null;

  amountPerMilisecond: number = null;

  intervalId: number = null;
  updateFrequencyInMs: number = 100;

  readonly currencySymbols: Array<any> = ["£", "$", "€"];
  currencySymbol: any = this.currencySymbols[0];

  constructor(private router: Router) {

    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        if (event.url === "/" && event.navigationTrigger === "imperative") {
          this.showResults = false;
        }
      });

  }

  ngOnInit() {

  }

  canCalculate(): boolean {
    return (this.dailyRate && this.dailyRate > 0
      && this.currencySymbol && this.startTime && this.endTime
      && (this.endTime > this.startTime));
  }

  calculate(): void {

    this.setUserSelectionOnURL();


    this.showResults = true;

    let dailyRateInPennies: number = (this.dailyRate * 100);

    let now: Date = new Date();
    this.startFullDate = this.buildDate(now, this.startTime);
    this.endFullDate = this.buildDate(now, this.endTime);

    this.amountPerMilisecond = (dailyRateInPennies / this.milisecondsBetweenDates(this.startFullDate, this.endFullDate));

    this.intervalId = window.setInterval(() => {
      this.updateCurrentAmount();
    }, this.updateFrequencyInMs);

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

    if (!this.workHasStarted()) {
      this.currentAmount = 0;
      return;
    }
    else if (this.workFinished()) {
      this.currentAmount = this.dailyRate;
      clearInterval(this.intervalId);
      return;
    }

    let milisecondsFromStart = this.milisecondsBetweenDates(this.startFullDate, now);

    this.currentAmount = Math.min(this.dailyRate, ((milisecondsFromStart * this.amountPerMilisecond) / 100));

  }

  private milisecondsBetweenDates(date1: Date, date2: Date): number {
    let diff = date1.getTime() - date2.getTime();

    return Math.abs(diff);
  }

  private buildDate(date: Date, time: string): Date {
    let hours = +time.split(':')[0];
    let minutes = +time.split(':')[1];

    let result = new Date(date);
    result.setHours(hours, minutes, 0, 0);
    return result;
  }

  private setUserSelectionOnURL(): void {

    let params = {
      dailyRate: this.dailyRate,
      currencySymbol: this.currencySymbol,
      startTime: this.startTime,
      endTime: this.endTime
    };

    this.router.navigate(['.'], { queryParams: params });
  }

}
