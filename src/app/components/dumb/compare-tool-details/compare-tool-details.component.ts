import { Component, OnInit, Input, OnDestroy} from '@angular/core';
import { UserSelection } from 'src/app/shared/models/user-selection.model';
import { DateHelper } from 'src/app/shared/helpers/date-helper';
import { AppConstants } from 'src/app/shared/constants/app-constants';

@Component({
  selector: 'app-compare-tool-details',
  templateUrl: './compare-tool-details.component.html',
  styleUrls: ['./compare-tool-details.component.scss']
})
export class CompareToolDetailsComponent implements OnInit, OnDestroy {

  @Input() userSelections: Array<UserSelection>;

  stopWatchIntervalId: number = null;
  timeElapsedSinceCalculated = "00:00";

  readonly tiles: any[] = [
    { codeName: "stopwatch", title: 'Stopwatch', amountProperty: 'stopwatchAmount', totalAmountProperty: null},
    { codeName: "hour", title: 'This Hour', amountProperty: 'currentHourAmount', totalAmountProperty: 'totalHourAmount'},
    { codeName: "today", title: 'Today', amountProperty: 'currentDayAmount', totalAmountProperty: 'totalDayAmount'},
    { codeName: "week", title: 'This Week', amountProperty: 'currentWeekAmount', totalAmountProperty: 'totalWeekAmount'},
    { codeName: "month", title: 'This Month', amountProperty: 'currentMonthAmount', totalAmountProperty: 'totalMonthAmount'},
    { codeName: "year", title: 'This Year', amountProperty: 'currentYearAmount', totalAmountProperty: 'totalYearAmount' }
  ];

  constructor() { }

  ngOnInit() {
    this.setupTimeElapsedInterval();
  }

  private setupTimeElapsedInterval(): void {
    this.stopWatchIntervalId = window.setInterval(() => {

      this.timeElapsedSinceCalculated = DateHelper.getFormattedTimeBetweenDates(this.userSelections[0].dateTimeWhenClickedCalculate);

    }, AppConstants.Common.UPDATE_STOPWATCH_FREQUENCY_IN_MS);
  }

  ngOnDestroy() {
    console.log("STOPWATCH CLEARED for compare tool");
    clearInterval(this.stopWatchIntervalId);
  }

}
