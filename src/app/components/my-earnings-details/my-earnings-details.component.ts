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

  tiles = AppConstants.Common.TILES;

  constructor() {

  }

  ngOnInit(): void {
    this.setupTimeElapsedInterval();
  }

  private setupTimeElapsedInterval(): void {
    this.stopWatchIntervalId = window.setInterval(() => {

      this.timeElapsedSinceCalculated = DateHelper.getFormattedTimeBetweenDates(this.userSelection.dateTimeWhenClickedCalculate);

    }, AppConstants.Common.UPDATE_STOPWATCH_FREQUENCY_IN_MS);
  }

  ngOnDestroy(): void {
    clearInterval(this.stopWatchIntervalId);
  }

}
