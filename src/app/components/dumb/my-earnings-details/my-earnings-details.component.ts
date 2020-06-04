import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserSelection } from 'src/app/shared/models/user-selection.model';
import { AppConstants } from 'src/app/shared/constants/app.constant';
import { DateHelper } from 'src/app/shared/helpers/date-helper';

@Component({
  selector: 'app-my-earnings-details',
  templateUrl: './my-earnings-details.component.html',
  styleUrls: ['./my-earnings-details.component.scss']
})
export class MyEarningsDetailsComponent implements OnInit, OnDestroy {

  @Input() userSelection: UserSelection;

  stopWatchIntervalId: number = null;
  timeElapsedSinceCalculated = "00:00";

  readonly tiles: any[] = [
    { codeName: "stopwatch", title: $localize`:@@tiles.stopwatch:Stopwatch`, amountProperty: 'stopwatchAmount', totalAmountProperty: null },
    { codeName: "hour", title: $localize`:@@tiles.this-hour:This hour`, amountProperty: 'currentHourAmount', totalAmountProperty: 'totalHourAmount' },
    { codeName: "today", title: $localize`:@@tiles.today:today`, amountProperty: 'currentDayAmount', totalAmountProperty: 'totalDayAmount' },
    { codeName: "week", title: $localize`:@@tiles.this-week:This week`, amountProperty: 'currentWeekAmount', totalAmountProperty: 'totalWeekAmount' },
    { codeName: "month", title: $localize`:@@tiles.this-month:This month`, amountProperty: 'currentMonthAmount', totalAmountProperty: 'totalMonthAmount' },
    { codeName: "year", title: $localize`:@@tiles.this-year:This year`, amountProperty: 'currentYearAmount', totalAmountProperty: 'totalYearAmount' }
  ];

  constructor() {

  }

  ngOnInit() {
    this.setupTimeElapsedInterval();
  }

  private setupTimeElapsedInterval(): void {
    this.stopWatchIntervalId = window.setInterval(() => {

      this.timeElapsedSinceCalculated = DateHelper.getFormattedTimeBetweenDates(this.userSelection.dateTimeWhenClickedCalculate);

    }, AppConstants.Common.UPDATE_STOPWATCH_FREQUENCY_IN_MS);
  }

  ngOnDestroy() {
    console.log("STOPWATCH CLEARED for single user");
    clearInterval(this.stopWatchIntervalId);
  }

}
