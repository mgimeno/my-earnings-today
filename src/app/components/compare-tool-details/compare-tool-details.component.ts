import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import ChartDataLabels, { Context as ChartDataLabelsContext } from 'chartjs-plugin-datalabels';
import { AppConstants } from '../../shared/constants/app.constant';
import { CurrencyDirective } from '../../shared/directives/currency.directive';
import { PeriodEnum } from '../../shared/enums/period.enum';
import { INameValue } from '../../shared/interfaces/name-value.interface';
import { UserSelection } from '../../shared/models/user-selection.model';
import { CommonHelper } from '../../shared/utils/common-helper';
import { DateHelper } from '../../shared/utils/date-helper';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  ChartDataLabels,
);

@Component({
  selector: 'app-compare-tool-details',
  imports: [
    CurrencyDirective,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './compare-tool-details.component.html',
  styleUrls: ['./compare-tool-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompareToolDetailsComponent implements OnInit, OnDestroy {
  readonly userSelections = input.required<UserSelection[]>();
  readonly timeElapsedSinceCalculated = signal('00:00');
  readonly isShowCharts = signal(true);
  readonly detailsAllTypes: INameValue[] = [
    {
      name: $localize`:@@compare-tool-details.already-earned:Already earned`,
      value: 'already-earned',
    },
    {
      name: $localize`:@@compare-tool-details.total-expected:Total expected`,
      value: 'total-expected',
    },
  ];
  readonly detailsSelectedType = signal<INameValue>(this.detailsAllTypes[0]);
  readonly isDetailsTypeAlreadyEarned = computed(
    () => this.detailsSelectedType().value === 'already-earned',
  );
  readonly visibleTiles = computed(() =>
    this.isDetailsTypeAlreadyEarned()
      ? AppConstants.Common.TILES
      : AppConstants.Common.TILES.slice(1),
  );

  private stopWatchIntervalId: number | null = null;
  private showChartsTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private hoursPerWeekChart: Chart<'bar'> | null = null;
  private compareEarningsChart: Chart<'bar'> | null = null;
  private compareEarningsChartCanvas =
    viewChild<ElementRef<HTMLCanvasElement>>('compareEarningsChart');
  private compareHoursWorkedChartCanvas =
    viewChild<ElementRef<HTMLCanvasElement>>('compareHoursWorkedChart');

  chartAllExpectedPeriods: INameValue[] = [
    { name: $localize`:@@compare-tool-details.this-hour:this hour`, value: PeriodEnum.CurrentHour },
    { name: $localize`:@@compare-tool-details.today:today`, value: PeriodEnum.CurrentDay },
    { name: $localize`:@@compare-tool-details.this-week:this week`, value: PeriodEnum.CurrentWeek },
    {
      name: $localize`:@@compare-tool-details.this-month:this month`,
      value: PeriodEnum.CurrentMonth,
    },
    { name: $localize`:@@compare-tool-details.this-year:this year`, value: PeriodEnum.CurrentYear },
  ];

  chartSelectedExpectedPeriod: INameValue = this.chartAllExpectedPeriods[3];

  chartAllHoursPeriods: INameValue[] = [
    { name: $localize`:@@compare-tool-details.day:day`, value: PeriodEnum.CurrentDay },
    { name: $localize`:@@compare-tool-details.week:week`, value: PeriodEnum.CurrentWeek },
    { name: $localize`:@@compare-tool-details.month:month`, value: PeriodEnum.CurrentMonth },
    { name: $localize`:@@compare-tool-details.year:year`, value: PeriodEnum.CurrentYear },
  ];

  chartSelectedHoursPeriod: INameValue = this.chartAllHoursPeriods[1];

  private readonly localeDecimalsSeparator = CommonHelper.getLocaleDecimalSeparator();

  ngOnInit(): void {
    this.setupTimeElapsedInterval();
    this.showCharts();
  }

  private setupTimeElapsedInterval(): void {
    if (this.stopWatchIntervalId) {
      clearInterval(this.stopWatchIntervalId);
    }

    this.stopWatchIntervalId = window.setInterval(() => {
      this.timeElapsedSinceCalculated.set(
        DateHelper.getFormattedTimeBetweenDates(
          this.userSelections()[0].dateTimeWhenClickedCalculate,
        ),
      );
    }, AppConstants.Common.UPDATE_STOPWATCH_FREQUENCY_IN_MS);
  }

  onChartExpectedPeriodChanged(): void {
    this.compareEarningsChart?.destroy();
    this.loadCompareEarningsChart();
  }

  onChartHoursPeriodChanged(): void {
    this.hoursPerWeekChart?.destroy();
    this.loadHoursWorkedPerWeekChart();
  }

  private loadCompareEarningsChart(): void {
    const ctx = this.compareEarningsChartCanvas()?.nativeElement.getContext('2d');

    if (!ctx) {
      return;
    }

    const labels: string[] = [];
    const data: number[] = [];

    let currencySymbol = this.userSelections()[0].currencySymbol;

    this.userSelections().forEach((us) => {
      if (us.currencySymbol !== currencySymbol) {
        currencySymbol = '';
      }

      labels.push(us.name);

      switch (this.chartSelectedExpectedPeriod.value) {
        case PeriodEnum.CurrentHour:
          data.push(us.totalHourAmount);
          break;
        case PeriodEnum.CurrentDay:
          data.push(us.totalDayAmount);
          break;
        case PeriodEnum.CurrentWeek:
          data.push(us.totalWeekAmount);
          break;
        case PeriodEnum.CurrentMonth:
          data.push(us.totalMonthAmount);
          break;
        case PeriodEnum.CurrentYear:
          data.push(us.totalYearAmount);
          break;
      }
    });

    this.compareEarningsChart = new Chart<'bar', number[], string>(ctx, {
      type: 'bar',

      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: AppConstants.Common.CHART_BACKGROUND_COLOURS,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (label) => `${currencySymbol}${Number(label).toLocaleString()}`,
            },
          },
        },
        plugins: {
          datalabels: {
            color: (context: ChartDataLabelsContext) => {
              return AppConstants.Common.CHART_BACKGROUND_COLOURS[context.dataIndex];
            },
            font: () => {
              return { size: 13, weight: 'bold' };
            },
            align: 'end',
            anchor: 'end',
            formatter: (_value: unknown, context: ChartDataLabelsContext) => {
              const index = context.dataIndex;
              const amount = Number(context.chart.data.datasets[0].data[index]);
              const symbol = this.userSelections()[index].currencySymbol;

              return this.formatCurrencyAmount(amount, symbol);
            },
          },
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        layout: { padding: { top: 32 } },
        aspectRatio: 1.25,
      },
    });
  }

  private loadHoursWorkedPerWeekChart(): void {
    const ctx = this.compareHoursWorkedChartCanvas()?.nativeElement.getContext('2d');

    if (!ctx) {
      return;
    }

    const labels: string[] = [];
    const data: number[] = [];

    this.userSelections().forEach((us) => {
      labels.push(us.name);

      switch (this.chartSelectedHoursPeriod.value) {
        case PeriodEnum.CurrentDay:
          data.push(us.workingHoursToday);
          break;
        case PeriodEnum.CurrentWeek:
          data.push(us.workingHoursThisWeek);
          break;
        case PeriodEnum.CurrentMonth:
          data.push(us.workingHoursThisMonth);
          break;
        case PeriodEnum.CurrentYear:
          data.push(us.workingHoursThisYear);
          break;
      }
    });

    this.hoursPerWeekChart = new Chart<'bar', number[], string>(ctx, {
      type: 'bar',

      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: AppConstants.Common.CHART_BACKGROUND_COLOURS,
            borderWidth: 1,
          },
        ],
      },

      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (label) => `${Number(label).toLocaleString()} h`,
            },
          },
        },
        plugins: {
          datalabels: {
            color: (context: ChartDataLabelsContext) => {
              return AppConstants.Common.CHART_BACKGROUND_COLOURS[context.dataIndex];
            },
            font: () => {
              return { size: 13, weight: 'bold' };
            },
            align: 'end',
            anchor: 'end',
            formatter: (_value: unknown, context: ChartDataLabelsContext) => {
              const index: number = context.dataIndex;
              const hours = Number(context.chart.data.datasets[0].data[index]);

              return this.formatHours(hours);
            },
          },
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        layout: { padding: { top: 32 } },
        aspectRatio: 2,
      },
    });
  }

  showCharts(): void {
    this.isShowCharts.set(true);

    if (this.showChartsTimeoutId) {
      clearTimeout(this.showChartsTimeoutId);
    }

    this.showChartsTimeoutId = window.setTimeout(() => {
      this.showChartsTimeoutId = null;
      this.destroyCharts();
      this.loadCompareEarningsChart();
      this.loadHoursWorkedPerWeekChart();
    });
  }

  showDetails(): void {
    this.isShowCharts.set(false);
    this.destroyCharts();
  }

  private destroyCharts(): void {
    this.hoursPerWeekChart?.destroy();
    this.compareEarningsChart?.destroy();
    this.hoursPerWeekChart = null;
    this.compareEarningsChart = null;
  }

  ngOnDestroy(): void {
    if (this.showChartsTimeoutId) {
      clearTimeout(this.showChartsTimeoutId);
    }

    if (this.stopWatchIntervalId) {
      clearInterval(this.stopWatchIntervalId);
    }
    this.destroyCharts();
  }

  private formatCurrencyAmount(amount: number, symbol: string): string | null {
    if (!amount) {
      return null;
    }

    const amountRoundedTo2Decimals = amount.toFixed(2);
    const indexOfDecimalSeparator = amountRoundedTo2Decimals.indexOf('.');
    const integerPart = Number(
      amountRoundedTo2Decimals.substring(0, indexOfDecimalSeparator),
    ).toLocaleString();

    if (Number.isInteger(+amountRoundedTo2Decimals)) {
      return `${symbol}${integerPart}`;
    }

    const decimalPart = amountRoundedTo2Decimals.substring(indexOfDecimalSeparator + 1);
    return `${symbol}${integerPart}${this.localeDecimalsSeparator}${decimalPart}`;
  }

  private formatHours(hours: number): string {
    return `${Number(hours.toFixed(2)).toLocaleString()} h`;
  }
}
