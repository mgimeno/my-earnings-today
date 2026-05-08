import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AppConstants } from '../../shared/constants/app.constant';
import { UserSelection } from '../../shared/models/user-selection.model';

@Component({
  selector: 'app-user-selection',
  imports: [
    FormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './user-selection.component.html',
  styleUrls: ['./user-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSelectionComponent implements AfterViewInit, OnDestroy {
  readonly userSelection = input.required<UserSelection>();
  readonly isCompareTool = input(false);
  readonly autoFocusRate = input(true);
  private readonly rateInput = viewChild<ElementRef<HTMLInputElement>>('rateInput');
  private focusRateInputTimeoutId: ReturnType<typeof setTimeout> | null = null;

  readonly fromPlaceholder = $localize`:@@user-selection.from:From`;
  readonly toPlaceholder = $localize`:@@user-selection.to:To`;

  readonly namePlaceholder = computed(() =>
    this.isOtherPerson()
      ? $localize`:@@user-selection.what-is-their-name:Their name`
      : $localize`:@@user-selection.what-is-your-name:Your name`,
  );
  readonly ratePlaceholder = computed(() =>
    this.isOtherPerson()
      ? $localize`:@@user-selection.how-much-they-earn:How much they earn?`
      : $localize`:@@user-selection.how-much-you-earn:How much you earn?`,
  );
  readonly workingWeekText = computed(() =>
    this.isOtherPerson()
      ? $localize`:@@user-selection.their-working-week-is:Their working week is`
      : $localize`:@@user-selection.your-working-week-is:Your working week is`,
  );
  readonly workingHoursText = computed(() =>
    this.isOtherPerson()
      ? $localize`:@@user-selection.their-working-hours-are:Their working hours are`
      : $localize`:@@user-selection.your-working-hours-are:Your working hours are`,
  );

  readonly allCurrencySymbols = AppConstants.Common.CURRENCY_SYMBOLS;
  readonly allFrequencies = AppConstants.Common.FREQUENCIES;
  readonly showName = computed(() => this.isCompareTool());

  focusRateInput(): void {
    this.rateInput()?.nativeElement.focus();
  }

  ngAfterViewInit(): void {
    if (!this.autoFocusRate()) {
      return;
    }

    this.focusRateInputTimeoutId = window.setTimeout(() => {
      this.focusRateInput();
      this.focusRateInputTimeoutId = null;
    });
  }

  ngOnDestroy(): void {
    if (this.focusRateInputTimeoutId) {
      clearTimeout(this.focusRateInputTimeoutId);
    }
  }

  private isOtherPerson(): boolean {
    return this.isCompareTool() && this.userSelection().personNumber > 1;
  }
}
