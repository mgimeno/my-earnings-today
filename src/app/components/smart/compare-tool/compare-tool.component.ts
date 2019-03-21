import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { StorageService } from 'src/app/shared/services/storage-service';
import { UserSelection } from 'src/app/shared/models/user-selection.model';
import { ShareBottomSheetComponent } from '../../dumb/share-bottom-sheet/share-bottom-sheet.component';
import { CommonHelper } from 'src/app/shared/helpers/common-helper';
import { UserSelectionValidationDialogComponent } from '../../dumb/user-selection-validation-dialog/user-selection-validation-dialog.component';

@Component({
  templateUrl: './compare-tool.component.html',
  styleUrls: ['./compare-tool.component.scss']
})
export class CompareToolComponent {

  userSelections: Array<UserSelection>;
  showResults: boolean = false;
  activeTabIndex: number = 0;

  constructor(
    private activeRoute: ActivatedRoute,
    private bottomSheet: MatBottomSheet,
    private storageService: StorageService,
    private validationDialog: MatDialog) {
    
    this.setupOnParamsChange();

    this.loadInitialUserSelections();
  }

  private loadInitialUserSelections(): void {

    this.userSelections = new Array<UserSelection>();

    for (let personNumber = 1; personNumber <= environment.compareToolMaxPersons; personNumber++) {

      if (this.storageService.hasUserSelectionOnURL(personNumber)) {
        let userSelection = this.storageService.getUserSelectionFromURL(personNumber);
        this.userSelections.push(userSelection);
        
      }
      else if (this.storageService.hasUserSelectionOnLocalStorage(personNumber)) {
        let userSelection = this.storageService.getUserSelectionFromLocalStorage(personNumber);
        this.userSelections.push(userSelection);
      }

    }

    if (this.canCalculate()) {
      this.calculate();
    }
    else if (!this.userSelections.length) {
      this.addPerson();
    }

  }

  private canCalculate(): boolean {
    return this.userSelections.length >= 2
      && (this.userSelections.length === this.userSelections.filter(us => { return us.canCalculate(); }).length);
  }

  private calculate(): void {

    this.storageService.saveUserSelectionsOnLocalStorage(this.userSelections);
    this.storageService.setUserSelectionsOnURL(this.userSelections);

    this.userSelections.forEach(us => { us.calculate(); });
    this.showResults = true;
  }

  tryCalculate(): void {
    
    if (this.canCalculate()) {
      this.calculate();
    }
    else {
      this.validationDialog.open(UserSelectionValidationDialogComponent, { data: this.userSelections });
    }
  }

  addPerson(): void {
    let personNumber = (this.userSelections.length + 1);

    let newUserSelection = new UserSelection(personNumber);
    newUserSelection.setDefaultValues();

    this.userSelections.push(newUserSelection);

    this.activeTabIndex = (personNumber - 1);
  }

  canAddMorePersons(): boolean {
    return this.userSelections.length < environment.compareToolMaxPersons;
  }

  

  private clearAllIntervals(): void {
    console.log("Compare tool selections destroyed");
    if (this.userSelections && this.userSelections.length) {
      this.userSelections.forEach(us => { us.clearResults(); });
    }
  }

  openShareBottomSheet(): void {
    this.bottomSheet.open(ShareBottomSheetComponent);
  }

  private setupOnParamsChange(): void {
    this.activeRoute.queryParams.subscribe(queryParams => {
      if (CommonHelper.isEmptyObject(queryParams)) {
        this.clearAllIntervals();
        this.showResults = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.clearAllIntervals();    
  }

}
