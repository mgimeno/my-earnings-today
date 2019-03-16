import { Component, OnInit, Input } from '@angular/core';
import { UserSelection } from 'src/app/shared/models/user-selection.model';

@Component({
  selector: 'app-compare-tool-details',
  templateUrl: './compare-tool-details.component.html',
  styleUrls: ['./compare-tool-details.component.scss']
})
export class CompareToolDetailsComponent implements OnInit {

  @Input() userSelections: Array<UserSelection>;

  readonly displayedColumns: string[] =
    ['name',
      'stopwatchAmount',
      'currentHourAmount',
      'currentDayAmount',
      'currentWeekAmount',
      'currentMonthAmount',
      'currentYearAmount'
    ];

  constructor() { }

  ngOnInit() {
  }

}
