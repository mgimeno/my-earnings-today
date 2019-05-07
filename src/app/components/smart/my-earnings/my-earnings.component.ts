import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { CommonHelper } from 'src/app/shared/helpers/common-helper';
import { ShareBottomSheetComponent } from '../../dumb/share-bottom-sheet/share-bottom-sheet.component';
import { UserSelection } from 'src/app/shared/models/user-selection.model';
import { StorageService } from 'src/app/shared/services/storage-service';
import { AppConstants } from 'src/app/shared/constants/app-constants';
import { UserSelectionValidationDialogComponent } from '../../dumb/user-selection-validation-dialog/user-selection-validation-dialog.component';


@Component({
  templateUrl: './my-earnings.component.html',
  styleUrls: ['./my-earnings.component.scss']
})
export class MyEarningsComponent implements OnDestroy {

  showResults: boolean = false;

  userSelection: UserSelection = null;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private storageService: StorageService,
    private dialog: MatDialog) {

    this.setupOnParamsChange();

    this.loadInitialUserSelection();
  }

  private loadInitialUserSelection(): void {

    let personNumber = 1;

    if (this.storageService.hasUserSelectionOnURL(personNumber)) {
      this.userSelection = this.storageService.getUserSelectionFromURL(personNumber);
    }
    else if (this.storageService.hasUserSelectionOnLocalStorage(personNumber)) {
      this.userSelection = this.storageService.getUserSelectionFromLocalStorage(personNumber);
    }
    else {
      this.userSelection = new UserSelection(personNumber);
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

  tryCalculate(): void {
    if (this.userSelection.canCalculate()) {
      this.calculate();
    }
    else {
      this.dialog.open(UserSelectionValidationDialogComponent, {
        data: { userSelections: [this.userSelection], isCompareTool: false }
      });
    }
  }

  goToCompare(): void {

    this.storageService.saveUserSelectionOnLocalStorage(this.userSelection);

    this.router.navigate(['/compare']);
  }

  openShareBottomSheet(): void {
    this.bottomSheet.open(ShareBottomSheetComponent);
  }

  private setupOnParamsChange(): void {
    this.activeRoute.queryParams.subscribe(queryParams => {
      if (CommonHelper.isEmptyObject(queryParams)) {
        if (this.userSelection) {
          this.userSelection.clearResults();
        }
        this.showResults = false;
      }
    });
  }

  ngOnDestroy(): void {
    console.log("Single User selection destroyed");
    this.userSelection.clearResults();
  }

}
