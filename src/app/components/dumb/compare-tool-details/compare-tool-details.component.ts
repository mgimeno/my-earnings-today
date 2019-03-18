import { Component, OnInit, Input, OnDestroy } from '@angular/core';
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

  readonly displayedColumns: string[] =
    ['name',
      'stopwatchAmount',
      'currentHourAmount',
      'currentDayAmount',
      'currentWeekAmount',
      'currentMonthAmount',
      'currentYearAmount'
    ];

  constructor() { }

  ngOnInit() {
    this.setupTimeElapsedInterval();
  }

  private setupTimeElapsedInterval(): void {
    this.stopWatchIntervalId = window.setInterval(() => {

      this.timeElapsedSinceCalculated = DateHelper.getTimeElapsedFromDate(this.userSelections[0].dateTimeWhenClickedCalculate);

    }, AppConstants.Common.UPDATE_STOPWATCH_FREQUENCY_IN_MS);
  }

  ngOnDestroy() {
    console.log("STOPWATCH CLEARED for compare tool");
    clearInterval(this.stopWatchIntervalId);
  }

}
