import { Component, Input, OnInit } from '@angular/core';
import { UserSelection } from 'src/app/shared/models/user-selection.model';
import { AppConstants } from 'src/app/shared/constants/app.constant';
import { INameValue } from 'src/app/shared/intefaces/name-value.interface';


@Component({
  selector: 'app-user-selection',
  templateUrl: './user-selection.component.html',
  styleUrls: ['./user-selection.component.scss']
})
export class UserSelectionComponent implements OnInit {

  @Input() userSelection: UserSelection;
  @Input() isCompareTool: boolean;


  fromPlaceholder = $localize`:@@user-selection.from:From`;
  toPlaceholder = $localize`:@@user-selection.to:To`;

  namePlaceholder: string = null;
  ratePlaceholder: string = null;
  workingWeekText: string = null;

  constructor() { }

  ngOnInit(): void {
    this.namePlaceholder = (this.isCompareTool && this.userSelection.personNumber > 1 ? $localize`:@@user-selection.what-is-their-name:What is their name?` : $localize`:@@user-selection.what-is-your-name:What is your name?`);
    this.ratePlaceholder = (this.isCompareTool && this.userSelection.personNumber > 1 ? $localize`:@@user-selection.how-much-they-earn:How much they earn?` : $localize`:@@user-selection.how-much-you-earn:How much you earn?`);
    this.workingWeekText = (this.isCompareTool && this.userSelection.personNumber > 1 ? $localize`:@@user-selection.their-working-week-is:Their working week is` : $localize`:@@user-selection.your-working-week-is:Your working week is`);
  }

  getAllCurrencySymbols(): string[] {
    return AppConstants.Common.CURRENCY_SYMBOLS;
  }

  getAllFrequencies(): INameValue[] {
    return AppConstants.Common.FREQUENCIES;
  }

  showName(): boolean {
    return this.isCompareTool;
  }


}
