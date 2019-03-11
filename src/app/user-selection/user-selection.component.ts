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
  @Input() isComparingTool: boolean;

  constructor() { }

  ngOnInit() {
  }

  getAllCurrencySymbols(): string[] {
    return AppConstants.Common.CURRENCY_SYMBOLS;
  }

  getAllFrequencies(): INameValue[] {
    return AppConstants.Common.FREQUENCIES;
  }

  getNamePlaceholder(): string {
    return this.isComparingTool && this.userSelection.personIndex > 0 ? "What is their name?" : "What is your name?";
  }

  getRatePlaceholder(): string {
    return this.isComparingTool && this.userSelection.personIndex > 0 ? "What is their rate?" : "What is your rate?";
  }

  getWorkingWeekText(): string {
    return this.isComparingTool && this.userSelection.personIndex > 0 ? "Their working week is" : "Your working week is";
  }

  showName(): boolean {
    return this.isComparingTool;
  }
   

}
