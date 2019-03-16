import { Component, Input, ViewEncapsulation } from '@angular/core';
import { UserSelection } from 'src/app/shared/models/user-selection.model';

@Component({
  selector: 'app-my-earnings-details',
  templateUrl: './my-earnings-details.component.html',
  styleUrls: ['./my-earnings-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyEarningsDetailsComponent {

  @Input() userSelection: UserSelection;

  tiles: any[] = [
    { codeName: "stopwatch", title: 'Stopwatch', amountProperty: 'stopwatchAmount', totalAmountProperty: null, color: 'lightblue' },
    { codeName: "hour", title: 'This Hour', amountProperty: 'currentHourAmount', totalAmountProperty: 'totalHourAmount', color: 'lightgray' },
    { codeName: "today", title: 'Today', amountProperty: 'currentDayAmount', totalAmountProperty: 'totalDayAmount', color: 'lightyellow'},
    { codeName: "week", title: 'This Week', amountProperty: 'currentWeekAmount', totalAmountProperty: 'totalWeekAmount',  color: 'lightgreen'},
    { codeName: "month", title: 'This Month', amountProperty: 'currentMonthAmount', totalAmountProperty: 'totalMonthAmount',  color: 'lightpink'},
    { codeName: "year", title: 'This Year', amountProperty: 'currentYearAmount', totalAmountProperty: 'totalYearAmount', color: '#DDBDF1'}
  ];

}
