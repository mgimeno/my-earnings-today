import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { UserSelection } from '../shared/models/user-selection.model';
import { CommonHelper } from '../shared/helpers/common-helper';

@Component({
  selector: 'app-my-earnings-details',
  templateUrl: './my-earnings-details.component.html',
  styleUrls: ['./my-earnings-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyEarningsDetailsComponent implements OnInit {

  @Input() userSelection: UserSelection;

  tiles: any[] = [
    { codeName: "today", title: 'Today',  color: 'lightblue'},
    { codeName: "week", title: 'This Week',  color: 'lightgreen'},
    { codeName: "month", title: 'This Month',  color: 'lightpink'},
    { codeName: "year", title: 'This Year', color: '#DDBDF1'}
  ];

  constructor() { }

  ngOnInit() {
  }

  getCurrencyPipeDigitsInfo(amount: number): string {
    return CommonHelper.getCurrencyPipeDigitsInfo(amount);
  }

}
