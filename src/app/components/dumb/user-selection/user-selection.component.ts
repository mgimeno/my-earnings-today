import { Component, Input } from '@angular/core';
import { UserSelection } from 'src/app/shared/models/user-selection.model';
import { AppConstants } from 'src/app/shared/constants/app-constants';
import { INameValue } from 'src/app/shared/intefaces/name-value.interface';


@Component({
  selector: 'app-user-selection',
  templateUrl: './user-selection.component.html',
  styleUrls: ['./user-selection.component.scss']
})
export class UserSelectionComponent {

  @Input() userSelection: UserSelection;
  @Input() isCompareTool: boolean;

  constructor() { }

  getAllCurrencySymbols(): string[] {
    return AppConstants.Common.CURRENCY_SYMBOLS;
  }

  getAllFrequencies(): INameValue[] {
    return AppConstants.Common.FREQUENCIES;
  }

  getNamePlaceholder(): string {
    return this.isCompareTool && this.userSelection.personNumber > 1 ? "What is their name?" : "What is your name?";
  }

  getRatePlaceholder(): string {
    return this.isCompareTool && this.userSelection.personNumber > 1 ? "How much they earn?" : "How much you earn?";
  }

  getWorkingWeekText(): string {
    return this.isCompareTool && this.userSelection.personNumber > 1 ? "Their working week is" : "Your working week is";
  }

  showName(): boolean {
    return this.isCompareTool;
  }
   

}
