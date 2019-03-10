import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { UserSelection } from '../shared/models/user-selection.model';
import { AppConstants } from '../shared/constants/app-constants';
import { INameValue } from '../shared/intefaces/name-value.interface';

@Component({
  selector: 'app-user-selection',
  templateUrl: './user-selection.component.html',
  styleUrls: ['./user-selection.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserSelectionComponent implements OnInit {

  @Input() userSelection: UserSelection;

  constructor() { }

  ngOnInit() {
  }

  getAllCurrencySymbols(): string[] {
    return AppConstants.Common.CURRENCY_SYMBOLS;
  }

  getAllFrequencies(): INameValue[] {
    return AppConstants.Common.FREQUENCIES;
  }
   

}
