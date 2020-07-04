import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UserSelection } from 'src/app/shared/models/user-selection.model';
import { DateHelper } from 'src/app/shared/helpers/date-helper';
import { AppConstants } from 'src/app/shared/constants/app.constant';
import * as Chart from 'chart.js/dist/Chart.js';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';
import { CommonHelper } from 'src/app/shared/helpers/common-helper';
import { INameValue } from 'src/app/shared/intefaces/name-value.interface';
import { PeriodEnum } from 'src/app/shared/enums/period.enum';

@Component({
  selector: 'app-compare-tool-details',
  templateUrl: './compare-tool-details.component.html',
  styleUrls: ['./compare-tool-details.component.scss']
})
export class CompareToolDetailsComponent implements OnInit, OnDestroy {

  @Input() userSelections: Array<UserSelection>;

  stopWatchIntervalId: number = null;
  timeElapsedSinceCalculated = "00:00";

  isShowCharts: boolean = true;

  hoursPerWeekChart: Chart;
  compareEarningsChart: Chart;

  chartAllExpectedPeriods: INameValue[] = [
    { name: $localize`:@@compare-tool-details.this-hour:this hour`, value: PeriodEnum.CurrentHour },
    { name: $localize`:@@compare-tool-details.today:today`, value: PeriodEnum.CurrentDay },
    { name: $localize`:@@compare-tool-details.this-week:this week`, value: PeriodEnum.CurrentWeek },
    { name: $localize`:@@compare-tool-details.this-month:this month`, value: PeriodEnum.CurrentMonth },
    { name: $localize`:@@compare-tool-details.this-year:this year`, value: PeriodEnum.CurrentYear }
  ];

  chartSelectedExpectedPeriod: INameValue = this.chartAllExpectedPeriods[3];

  chartAllHoursPeriods: INameValue[] = [
    { name: $localize`:@@compare-tool-details.day:day`, value: PeriodEnum.CurrentDay },
    { name: $localize`:@@compare-tool-details.week:week`, value: PeriodEnum.CurrentWeek },
    { name: $localize`:@@compare-tool-details.month:month`, value: PeriodEnum.CurrentMonth },
    { name: $localize`:@@compare-tool-details.year:year`, value: PeriodEnum.CurrentYear }
  ];

  chartSelectedHoursPeriod: INameValue = this.chartAllHoursPeriods[1];

  detailsAllTypes: INameValue[] = [
    { name: $localize`:@@compare-tool-details.already-earned:Already earned`, value: "already-earned" },
    { name: $localize`:@@compare-tool-details.total-expected:Total expected`, value: "total-expected" }
  ];

  detailsSelectedType: INameValue = this.detailsAllTypes[0];



  tiles = AppConstants.Common.TILES;

  private readonly localeDecimalsSeparator = CommonHelper.getLocaleDecimalSeparator();

  constructor() { }

  ngOnInit(): void {

    this.setupTimeElapsedInterval();
    this.showCharts();
  }

  private setupTimeElapsedInterval(): void {
    this.stopWatchIntervalId = window.setInterval(() => {

      this.timeElapsedSinceCalculated = DateHelper.getFormattedTimeBetweenDates(this.userSelections[0].dateTimeWhenClickedCalculate);

    }, AppConstants.Common.UPDATE_STOPWATCH_FREQUENCY_IN_MS);
  }

  onChartExpectedPeriodChanged(): void {
    this.compareEarningsChart.destroy();
    this.loadCompareEarningsChart();
  }

  onChartHoursPeriodChanged(): void {
    this.hoursPerWeekChart.destroy();
    this.loadHoursWorkedPerWeekChart();
  }

  isDetailsTypeAlreadyEarned(): boolean {
    return this.detailsSelectedType.value === "already-earned";
  }

  //todo Fix this, instead of getting the tiles from a method (called many times), on change of the this.detailsSelectedType.value, assign the tiles array to the variable tiles
  getTiles(): any[] {
    if (this.isDetailsTypeAlreadyEarned()) {
      return this.tiles;
    }
    return this.tiles.slice(1);

  }

  private loadCompareEarningsChart(): void {

    const canvas = <HTMLCanvasElement>document.getElementById("compare-earnings-chart");
    const ctx = canvas.getContext('2d');

    let labels: string[] = [];
    let data: number[] = [];

    let currencySymbol = this.userSelections[0].currencySymbol;

    this.userSelections.forEach(us => {

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


    this.compareEarningsChart = new Chart(ctx, {

      type: "bar",

      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: AppConstants.Common.CHART_BACKGROUND_COLOURS,
          borderWidth: 1,
        }]
      },
      plugins: [ChartDataLabels],
      options: {
        plugins: {
          datalabels: {
            color: (context: ChartDataLabels.Context) => {
              return AppConstants.Common.CHART_BACKGROUND_COLOURS[context.dataIndex];
            },
            font: (context: ChartDataLabels.Context) => {
              return { size: 13, weight: "bold" };
            },
            align: 'end',
            anchor: 'end',
            formatter: (value: any, context: ChartDataLabels.Context) => {

              const index = context.dataIndex;
              const amount: number = Number(context.chart.data.datasets[0].data[index]);

              if (!amount) {
                return null;
              }

              const symbol = this.userSelections[index].currencySymbol;

              const amountRoundedTo2Decimals = amount.toFixed(2);

              const indexOfDecimalSeparator = amountRoundedTo2Decimals.indexOf("."); //TODO try if this works in spanish locale
              const integerPart = Number(amountRoundedTo2Decimals.substring(0, indexOfDecimalSeparator)).toLocaleString(); //toLocaleString applies rounding, do only to integer part.

              if (Number.isInteger(+amountRoundedTo2Decimals)) {

                return `${symbol}${integerPart}`;

              }
              else {
                const decimalPart = amountRoundedTo2Decimals.substring(indexOfDecimalSeparator + 1);
                //TODO do I need all this or I can just use the currency pipe? (langs?)
                return `${symbol}${integerPart}${this.localeDecimalsSeparator}${decimalPart}`;
              }
            }
          }
        },
        responsive: true,
        scales: {
          yAxes: [{
            ticks:
            {
              beginAtZero: true,
              callback: (label, index, labels) => {
                return currencySymbol + label.toLocaleString();
              }
            }
          }]
        },
        legend: {
          display: false
        },
        layout: {
          padding: {
            top: 32
          }
        },
        aspectRatio: 1.25,
        tooltips: {
          enabled: false
        }
      }

    });


  }

  private loadHoursWorkedPerWeekChart(): void {

    const canvas = <HTMLCanvasElement>document.getElementById("compare-hours-worked-chart");
    const ctx = canvas.getContext('2d');

    let labels: string[] = [];
    let data: number[] = [];

    this.userSelections.forEach(us => {
      labels.push(us.name);

      switch (this.chartSelectedHoursPeriod.value) {
        case PeriodEnum.CurrentDay:
          data.push(us.workingHoursToday);
          break;
        case PeriodEnum.CurrentWeek:
          data.push(us.workingHoursThisWeek);
          break;
        case PeriodEnum.CurrentMonth:
          data.push(us.workingHoursThisWeek * 4.34524);
          break;
        case PeriodEnum.CurrentYear:
          data.push(us.workingHoursThisYear);
          break;
      }

    });


    this.hoursPerWeekChart = new Chart(ctx, {

      type: "bar",

      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: AppConstants.Common.CHART_BACKGROUND_COLOURS,
          borderWidth: 1
        }]
      },

      options: {
        plugins: {
          datalabels: {
            color: (context: ChartDataLabels.Context) => {
              return AppConstants.Common.CHART_BACKGROUND_COLOURS[context.dataIndex];
            },
            font: (context: ChartDataLabels.Context) => {
              return { size: 13, weight: "bold" };
            },
            align: 'end',
            anchor: 'end',
            formatter: (value: any, context: ChartDataLabels.Context) => {

              const index: number = context.dataIndex;
              const hours: number = <number>context.chart.data.datasets[0].data[index];

              return `${(Number.isInteger(hours) ? hours : hours.toFixed(2)).toLocaleString()} h`;
            }
          }
        },
        responsive: true,
        scales: {
          yAxes: [{
            ticks:
            {
              beginAtZero: true,
              callback: (label, index, labels) => {
                return label.toLocaleString() + " h";
              }
            }
          }]
        },
        legend: {
          display: false
        },
        layout: {
          padding: {
            top: 32
          }
        },
        aspectRatio: 2,
        tooltips: {
          enabled: false
        }
      }

    });

  }

  showCharts(): void {
    this.isShowCharts = true;

    setTimeout(() => {
      this.loadCompareEarningsChart();
      this.loadHoursWorkedPerWeekChart();
    }, 100);

  }

  showDetails(): void {
    this.isShowCharts = false;
    this.destroyCharts();
  }

  private destroyCharts(): void {
    this.hoursPerWeekChart.destroy();
    this.compareEarningsChart.destroy();
  }

  ngOnDestroy(): void {
    clearInterval(this.stopWatchIntervalId);
    this.destroyCharts();
  }

}
