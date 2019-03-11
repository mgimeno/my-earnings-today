import { Component } from '@angular/core';
import { UserSelection } from '../shared/models/user-selection.model';
import { environment } from 'src/environments/environment';
import { CommonHelper } from '../shared/helpers/common-helper';
import { ActivatedRoute } from '@angular/router';
import { ShareBottomSheetComponent } from '../share-bottom-sheet/share-bottom-sheet.component';
import { MatBottomSheet } from '@angular/material';

@Component({
  templateUrl: './compare-tool.component.html',
  styleUrls: ['./compare-tool.component.scss']
})
export class CompareToolComponent {

  userSelections: Array<UserSelection>;
  showResults: boolean = false;
  activeTabIndex: number = 0;

  constructor(private activeRoute: ActivatedRoute, private bottomSheet: MatBottomSheet) {
    this.userSelections = new Array<UserSelection>();
    this.addPerson();

    this.activeRoute.queryParams.subscribe(queryParams => {
      if (CommonHelper.isEmptyObject(queryParams)) {
        this.clearAllIntervals();
        this.showResults = false;
      }
    });
  }

  canCalculate(): boolean {
    return this.userSelections.length >= 2
      && (this.userSelections.length === this.userSelections.filter(us => { return us.canCalculate(); }).length);
  }

  calculate(): void {
    this.userSelections.forEach(us => { us.calculate(); });
    this.showResults = true;
  }

  addPerson(): void {
    let personIndex = this.userSelections.length;
    let newUserSelection = new UserSelection(personIndex);
    newUserSelection.setDefaultValues();
    this.userSelections.push(newUserSelection);

    this.activeTabIndex = personIndex;
  }

  canAddMorePersons(): boolean {
    return this.userSelections.length < environment.compareToolMaxPersons;
  }

  getCurrencyPipeDigitsInfo(amount: number): string {
    return CommonHelper.getCurrencyPipeDigitsInfo(amount);
  }

  private clearAllIntervals(): void {
    console.log("Compare tool selections destroyed");
    this.userSelections.forEach(us => { us.clearUpdateCurrentAmountInterval(); });
  }

  openShareBottomSheet(): void {
    this.bottomSheet.open(ShareBottomSheetComponent);
  }

  ngOnDestroy(): void {
    this.clearAllIntervals();    
  }

}
