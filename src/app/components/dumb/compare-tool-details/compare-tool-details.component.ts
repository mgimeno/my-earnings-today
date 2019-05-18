import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UserSelection } from 'src/app/shared/models/user-selection.model';
import { DateHelper } from 'src/app/shared/helpers/date-helper';
import { AppConstants } from 'src/app/shared/constants/app-constants';
import * as Chart from 'chart.js';
import { ChartTooltipItem, ChartData } from 'chart.js';
import { INameValue } from '../../../shared/intefaces/name-value.interface';
import { PeriodEnum } from '../../../shared/enums/period.enum';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';

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

  //todo ?
  chartAllPeriods: INameValue[] = [
    { name: "this hour", value: PeriodEnum.CurrentHour },
    { name: "today", value: PeriodEnum.CurrentDay },
    { name: "this week", value: PeriodEnum.CurrentWeek },
    { name: "this month", value: PeriodEnum.CurrentMonth },
    { name: "this year", value: PeriodEnum.CurrentYear }
  ];

  chartSelectedPeriod: INameValue = this.chartAllPeriods[3];

  detailsAllTypes: INameValue[] = [ //todo constanst?
    { name: "Already earned", value: "already-earned" },
    { name: "Total expected", value: "total-expected" }
  ];

  detailsSelectedType: INameValue = this.detailsAllTypes[0];

  //TODO colours? prob use same than the tiles. also put this as constants or so
  private readonly chartBackgroundColours: string[] = [
    "rgb(255, 99, 132)",
    "#3e95cd",
    "rgb(255, 205, 86)",
    "#8e5ea2",
    "#71cdcd"
  ];

  readonly tiles: any[] = [
    { codeName: "stopwatch", title: 'Stopwatch', amountProperty: 'stopwatchAmount', totalAmountProperty: null },
    { codeName: "hour", title: 'This Hour', amountProperty: 'currentHourAmount', totalAmountProperty: 'totalHourAmount' },
    { codeName: "today", title: 'Today', amountProperty: 'currentDayAmount', totalAmountProperty: 'totalDayAmount' },
    { codeName: "week", title: 'This Week', amountProperty: 'currentWeekAmount', totalAmountProperty: 'totalWeekAmount' },
    { codeName: "month", title: 'This Month', amountProperty: 'currentMonthAmount', totalAmountProperty: 'totalMonthAmount' },
    { codeName: "year", title: 'This Year', amountProperty: 'currentYearAmount', totalAmountProperty: 'totalYearAmount' }
  ];

  private readonly decimalsSeparator = '.'; //TODO this has to be locale, depending on the browser lang. Investigate how (related to toLocaleString())

  constructor() { }

  ngOnInit() {

    this.setupTimeElapsedInterval();
    this.showCharts();
  }

  private setupTimeElapsedInterval(): void {
    this.stopWatchIntervalId = window.setInterval(() => {

      this.timeElapsedSinceCalculated = DateHelper.getFormattedTimeBetweenDates(this.userSelections[0].dateTimeWhenClickedCalculate);

    }, AppConstants.Common.UPDATE_STOPWATCH_FREQUENCY_IN_MS);
  }

  onChartPeriodChanged(): void {
    this.compareEarningsChart.destroy();
    this.loadCompareEarningsChart();
  }

  isDetailsTypeAlreadyEarned(): boolean {
    return this.detailsSelectedType.value === "already-earned";
  }

  private loadCompareEarningsChart(): void {



    let canvas = <HTMLCanvasElement>document.getElementById("compare-earnings-chart");
    let ctx = canvas.getContext('2d');

    let labels: string[] = [];
    let data: number[] = [];

    this.userSelections.forEach(us => {

      labels.push(us.name);

      switch (this.chartSelectedPeriod.value) {
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
          backgroundColor: this.chartBackgroundColours,
          borderWidth: 1,
        }]
      },
      plugins: [ChartDataLabels],
      options: {
        plugins: {
          datalabels: {
            color: (context: ChartDataLabels.Context) => {
              return this.chartBackgroundColours[context.dataIndex];
            },
            font: (context: ChartDataLabels.Context) => {
              return { size: 13, weight: "bold" };
            },
            align: 'end',
            anchor: 'end',
            formatter: (value: any, context: ChartDataLabels.Context) => {
              
              let index = context.dataIndex;
              let amount: number = Number(context.chart.data.datasets[0].data[index]);

              if (!amount) {
                return null;
              }

              let symbol = this.userSelections[index].currencySymbol;

              let amountRoundedTo2Decimals = amount.toFixed(2);

              let indexOfDecimalSeparator = amountRoundedTo2Decimals.indexOf("."); //TODO try if this works in spanish locale
              let integerPart = Number(amountRoundedTo2Decimals.substring(0, indexOfDecimalSeparator)).toLocaleString(); //toLocaleString applies rounding, do only to integer part.

              if (Number.isInteger(+amountRoundedTo2Decimals)) {

                return `${symbol}${integerPart}`;

              }
              else {
                let decimalPart = amountRoundedTo2Decimals.substring(indexOfDecimalSeparator + 1);
                //TODO do I need all this or I can just use the currency pipe? (langs?)
                return `${symbol}${integerPart}${this.decimalsSeparator}${decimalPart}`;
              }
            }
          }
        },
        responsive: true,
        scales: {
          yAxes: [{ ticks: { beginAtZero: true } }]
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

    //todo create a helper/service that handles charts.

    let canvas = <HTMLCanvasElement>document.getElementById("compare-hours-worked-chart");
    let ctx = canvas.getContext('2d');

    let labels: string[] = [];
    let data: number[] = [];

    this.userSelections.forEach(us => {
      labels.push(us.name);
      data.push(us.workingHoursThisWeek);
    });


    this.hoursPerWeekChart = new Chart(ctx, {

      type: "bar",

      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: this.chartBackgroundColours,
          borderWidth: 1
        }]
      },

      options: {
        plugins: {
          datalabels: {
            color: (context: ChartDataLabels.Context) => {
              return this.chartBackgroundColours[context.dataIndex];
            },
            font: (context: ChartDataLabels.Context) => {
              return { size: 13, weight: "bold" };
            },
            align: 'end',
            anchor: 'end',
            formatter: (value: any, context: ChartDataLabels.Context) => {

              let index: number = context.dataIndex;
              let hours: number = <number>context.chart.data.datasets[0].data[index];

              return `${Number.isInteger(hours) ? hours : hours.toFixed(2)}h`;
            }
          }
        },
        responsive: true,
        scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
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
    console.log("STOPWATCH CLEARED for compare tool");
    clearInterval(this.stopWatchIntervalId);

    this.destroyCharts();
  }

}
