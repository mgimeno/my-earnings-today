import { Component, Input, ViewEncapsulation, OnDestroy, OnInit , Inject} from '@angular/core';
import { UserSelection } from 'src/app/shared/models/user-selection.model';
import { AppConstants } from 'src/app/shared/constants/app-constants';
import { DateHelper } from 'src/app/shared/helpers/date-helper';

@Component({
  selector: 'app-my-earnings-details',
  templateUrl: './my-earnings-details.component.html',
  styleUrls: ['./my-earnings-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyEarningsDetailsComponent implements OnInit, OnDestroy{

  @Input() userSelection: UserSelection;

  stopWatchIntervalId: number = null;
  timeElapsedSinceCalculated = "00:00";

  readonly tiles: any[] = [
    { codeName: "stopwatch", title: 'Stopwatch', amountProperty: 'stopwatchAmount', totalAmountProperty: null, color: 'lightblue' },
    { codeName: "hour", title: 'This Hour', amountProperty: 'currentHourAmount', totalAmountProperty: 'totalHourAmount', color: 'lightgray' },
    { codeName: "today", title: 'Today', amountProperty: 'currentDayAmount', totalAmountProperty: 'totalDayAmount', color: 'lightyellow'},
    { codeName: "week", title: 'This Week', amountProperty: 'currentWeekAmount', totalAmountProperty: 'totalWeekAmount',  color: 'lightgreen'},
    { codeName: "month", title: 'This Month', amountProperty: 'currentMonthAmount', totalAmountProperty: 'totalMonthAmount',  color: 'lightpink'},
    { codeName: "year", title: 'This Year', amountProperty: 'currentYearAmount', totalAmountProperty: 'totalYearAmount', color: '#DDBDF1'}
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
