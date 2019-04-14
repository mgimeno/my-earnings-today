import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UserSelection } from 'src/app/shared/models/user-selection.model';
import { DateHelper } from 'src/app/shared/helpers/date-helper';
import { AppConstants } from 'src/app/shared/constants/app-constants';
import * as Chart from 'chart.js';
import { ChartTooltipItem, ChartData } from 'chart.js';
import { INameValue } from '../../../shared/intefaces/name-value.interface';
import { PeriodEnum } from '../../../shared/enums/period.enum';

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
  allPeriods: INameValue[] = [
    { name: "hour", value: PeriodEnum.CurrentHour },
    { name: "day", value: PeriodEnum.CurrentDay },
    { name: "week", value: PeriodEnum.CurrentWeek },
    { name: "month", value: PeriodEnum.CurrentMonth },
    { name: "year", value: PeriodEnum.CurrentYear }
  ];

  selectedChartPeriod: INameValue = this.allPeriods[3];

  //TODO colours? prob use same than the tiles. also put this as constants or so
  private readonly chartBackgroundColours: string[] = [
    "rgb(255, 99, 132)",
    "rgb(54, 162, 235)",
    "rgb(255, 205, 86)",
    "#3e95cd", "#8e5ea2"//, "#3cba9f", "#e8c3b9", "#c45850",
    //    "gray", "black", "red", "yellow"
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
    console.log(this.selectedChartPeriod);
    this.compareEarningsChart.destroy();
    this.loadCompareEarningsChart();
  }

  private loadCompareEarningsChart(): void {

    let canvas = <HTMLCanvasElement>document.getElementById("compare-earnings-chart");
    let ctx = canvas.getContext('2d');

    let labels: string[] = [];
    let data: number[] = [];

    this.userSelections.forEach(us => {

      labels.push(us.name);

      switch (this.selectedChartPeriod.value) {
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
          borderWidth: 1
        }]
      },

      options: {
        responsive: true,
        legend: {
          display: false,
        },
        tooltips: {
          xPadding: 12,
          yPadding: 12,
          callbacks: {
            title: (tooltipItem: ChartTooltipItem[], data: ChartData) => {
              return "";
            },
            label: (tooltipItem: ChartTooltipItem, data: ChartData) => {

              let index = tooltipItem.index;
              let amount: number = Number(data.datasets[0].data[index]);

              if (!amount) {
                return null;
              }

              let symbol = this.userSelections[index].currencySymbol;

              let amountRoundedTo2Decimals = amount.toFixed(2);

              let indexOfDecimalSeparator = amountRoundedTo2Decimals.indexOf("."); //TODO try if this works in spanish locale
              let integerPart = Number(amountRoundedTo2Decimals.substring(0, indexOfDecimalSeparator)).toLocaleString(); //toLocaleString applies rounding, do only to integer part.

              if (Number.isInteger(+amountRoundedTo2Decimals)) {

                return `${data.labels[index]}: ${symbol}${integerPart}`;
                
              }
              else {
                let decimalPart = amountRoundedTo2Decimals.substring(indexOfDecimalSeparator + 1);
                //TODO do I need all this or I can just use the currency pipe? (langs?)
                return `${data.labels[index]}: ${symbol}${integerPart}${this.decimalsSeparator}${decimalPart}`;
              }

            }
          }
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
        responsive: true,
        legend: {
          display: false,
        },
        tooltips: {
          xPadding: 12,
          yPadding: 12,
          callbacks: {
            title: (tooltipItem: ChartTooltipItem[], data: ChartData) => {
              return "";
            },
            label: (tooltipItem: ChartTooltipItem, data: ChartData) => {

              let index = tooltipItem.index;
              let value = data.datasets[0].data[index];
              let label = `${data.labels[index]}: ${value} hours`;

              return label;
            }
          }
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
