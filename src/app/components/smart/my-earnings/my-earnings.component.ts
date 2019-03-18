import { Component, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { CommonHelper } from 'src/app/shared/helpers/common-helper';
import { ShareBottomSheetComponent } from '../../dumb/share-bottom-sheet/share-bottom-sheet.component';
import { UserSelection } from 'src/app/shared/models/user-selection.model';
import { StorageService } from 'src/app/shared/services/storage-service';
import { AppConstants } from 'src/app/shared/constants/app-constants';
import { UserSelectionValidationDialogComponent } from '../../dumb/user-selection-validation-dialog/user-selection-validation-dialog.component';


@Component({
  templateUrl: './my-earnings.component.html',
  styleUrls: ['./my-earnings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyEarningsComponent implements OnDestroy {

  showResults: boolean = false;

  userSelection: UserSelection = null;

  constructor(
    private activeRoute: ActivatedRoute,
    private bottomSheet: MatBottomSheet,
    private storageService: StorageService,
    private validationDialog: MatDialog) {

    this.loadInitialUserSelection();

    this.setupOnParamsChange();

  }

  private loadInitialUserSelection(): void {

    if (this.storageService.hasUserSelectionOnURL()) {
      this.userSelection = this.storageService.getUserSelectionFromURL();
    }
    else if (this.storageService.hasUserSelectionOnLocalStorage()) {
      this.userSelection = this.storageService.getUserSelectionFromLocalStorage();
    }
    else {
      this.userSelection = new UserSelection();
      this.userSelection.setDefaultValues();
    }

    if (this.userSelection.canCalculate()) {
      this.calculate();
    }

  }

  private calculate(): void {

    this.storageService.saveUserSelectionOnLocalStorage(this.userSelection);
    this.storageService.setUserSelectionOnURL(this.userSelection);

    this.userSelection.calculate();

    this.showResults = true;

  }

  private canCalculate(): boolean {
    return this.userSelection.canCalculate();
  }

  tryCalculate(): void {
    if (this.canCalculate()) {
      this.calculate();
    }
    else {
      this.validationDialog.open(UserSelectionValidationDialogComponent, { data: [this.userSelection]} );
    }
  }

  goToCompare(): void {

    this.userSelection.personNumber = 1;
    this.userSelection.name = AppConstants.Common.FIRST_USER_DEFAULT_NAME;

    this.storageService.cleanUserSelectionsOnLocalStorage();
    this.storageService.setUserSelectionsOnURL([this.userSelection]);
  }

  openShareBottomSheet(): void {
    this.bottomSheet.open(ShareBottomSheetComponent);
  }

  private setupOnParamsChange(): void {
    this.activeRoute.queryParams.subscribe(queryParams => {
      if (CommonHelper.isEmptyObject(queryParams)) {
        this.userSelection.clearResults();
        this.showResults = false;
      }
    });
  }

  ngOnDestroy(): void {
    console.log("Single User selection destroyed");
    this.userSelection.clearResults();
  }

}
