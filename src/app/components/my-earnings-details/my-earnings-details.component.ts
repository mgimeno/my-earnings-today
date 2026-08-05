import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { AppConstants } from '../../shared/constants/app.constant';
import { CurrencyDirective } from '../../shared/directives/currency.directive';
import { UserSelection } from '../../shared/models/user-selection.model';
import { ClockService } from '../../shared/services/clock.service';
import { DateHelper } from '../../shared/utils/date-helper';

@Component({
  selector: 'app-my-earnings-details',
  imports: [CurrencyDirective],
  templateUrl: './my-earnings-details.component.html',
  styleUrls: ['./my-earnings-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyEarningsDetailsComponent {
  private readonly clock = inject(ClockService);

  readonly userSelection = input.required<UserSelection>();
  readonly tiles = AppConstants.Common.TILES;

  // The amounts live on the model as plain fields, so the template reads this
  // signal to make the tick an explicit change detection dependency.
  private readonly amountsUpdatedAt = signal(new Date());

  readonly timeElapsedSinceCalculated = computed(() =>
    DateHelper.getFormattedTimeBetweenDates(
      this.userSelection().dateTimeWhenClickedCalculate,
      this.amountsUpdatedAt(),
    ),
  );

  constructor() {
    effect(() => {
      const now = this.clock.now();

      this.userSelection().updateAmounts(now);
      this.amountsUpdatedAt.set(now);
    });
  }
}
