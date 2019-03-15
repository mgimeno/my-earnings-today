import { Component, Input, ViewEncapsulation } from '@angular/core';
import { UserSelection } from '../shared/models/user-selection.model';

@Component({
  selector: 'app-my-earnings-details',
  templateUrl: './my-earnings-details.component.html',
  styleUrls: ['./my-earnings-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyEarningsDetailsComponent {

  @Input() userSelection: UserSelection;

  tiles: any[] = [
    { codeName: "sincecliked", title: 'Since clicked', color: 'lightblue' },
    { codeName: "hour", title: 'This Hour', color: 'lightgray' },
    { codeName: "today", title: 'Today', color: 'lightyellow'},
    { codeName: "week", title: 'This Week',  color: 'lightgreen'},
    { codeName: "month", title: 'This Month',  color: 'lightpink'},
    { codeName: "year", title: 'This Year', color: '#DDBDF1'}
  ];

  constructor() { }

}
