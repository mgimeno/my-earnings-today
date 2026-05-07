import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { AppConstants } from '../../shared/constants/app.constant';
import { CurrencyDirective } from '../../shared/directives/currency.directive';
import { UserSelection } from '../../shared/models/user-selection.model';
import { DateHelper } from '../../shared/utils/date-helper';

@Component({
  selector: 'app-my-earnings-details',
  imports: [CurrencyDirective],
  templateUrl: './my-earnings-details.component.html',
  styleUrls: ['./my-earnings-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyEarningsDetailsComponent implements OnInit, OnDestroy {
  readonly userSelection = input.required<UserSelection>();
  readonly timeElapsedSinceCalculated = signal('00:00');
  readonly tiles = AppConstants.Common.TILES;

  private stopWatchIntervalId: number | null = null;

  ngOnInit(): void {
    this.setupTimeElapsedInterval();
  }

  private setupTimeElapsedInterval(): void {
    if (this.stopWatchIntervalId) {
      clearInterval(this.stopWatchIntervalId);
    }

    this.stopWatchIntervalId = window.setInterval(() => {
      this.timeElapsedSinceCalculated.set(
        DateHelper.getFormattedTimeBetweenDates(this.userSelection().dateTimeWhenClickedCalculate),
      );
    }, AppConstants.Common.UPDATE_STOPWATCH_FREQUENCY_IN_MS);
  }

  ngOnDestroy(): void {
    if (this.stopWatchIntervalId) {
      clearInterval(this.stopWatchIntervalId);
    }
  }
}
