import { Component, OnInit, Input, OnDestroy, ViewEncapsulation} from '@angular/core';
import { UserSelection } from 'src/app/shared/models/user-selection.model';
import { DateHelper } from 'src/app/shared/helpers/date-helper';
import { AppConstants } from 'src/app/shared/constants/app-constants';

@Component({
  selector: 'app-compare-tool-details',
  templateUrl: './compare-tool-details.component.html',
  styleUrls: ['./compare-tool-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CompareToolDetailsComponent implements OnInit, OnDestroy {

  @Input() userSelections: Array<UserSelection>;

  stopWatchIntervalId: number = null;
  timeElapsedSinceCalculated = "00:00";

  readonly displayedColumns: string[] =
    ['name',
      'stopwatchAmount',
      'currentHourAmount',
      'currentDayAmount',
      'currentWeekAmount',
      'currentMonthAmount',
      'currentYearAmount'
    ];

  readonly tiles: any[] = [
    { codeName: "stopwatch", title: 'Stopwatch', amountProperty: 'stopwatchAmount', totalAmountProperty: null, color: 'lightblue' },
    { codeName: "hour", title: 'This Hour', amountProperty: 'currentHourAmount', totalAmountProperty: 'totalHourAmount', color: 'lightgray' },
    { codeName: "today", title: 'Today', amountProperty: 'currentDayAmount', totalAmountProperty: 'totalDayAmount', color: 'lightyellow' },
    { codeName: "week", title: 'This Week', amountProperty: 'currentWeekAmount', totalAmountProperty: 'totalWeekAmount', color: 'lightgreen' },
    { codeName: "month", title: 'This Month', amountProperty: 'currentMonthAmount', totalAmountProperty: 'totalMonthAmount', color: 'lightpink' },
    { codeName: "year", title: 'This Year', amountProperty: 'currentYearAmount', totalAmountProperty: 'totalYearAmount', color: '#DDBDF1' }
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
