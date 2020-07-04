import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { CommonHelper } from 'src/app/shared/helpers/common-helper';
import { UserSelection } from 'src/app/shared/models/user-selection.model';
import { StorageService } from 'src/app/shared/services/storage-service';
import { UserSelectionValidationDialogComponent } from '../user-selection-validation-dialog/user-selection-validation-dialog.component';
import { ShareBottomSheetComponent } from '../share-bottom-sheet/share-bottom-sheet.component';


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

    const personNumber = 1;

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

    window.scrollTo(0, 0);
  }

  tryCalculate(): void {
    if (this.userSelection.canCalculate()) {
      this.calculate();
    }
    else {
      this.dialog.open(UserSelectionValidationDialogComponent, {
        data: { userSelections: [this.userSelection], isCompareTool: false },
        minWidth: 320
      });
    }
  }

  goToCompare(): void {

    this.storageService.saveUserSelectionOnLocalStorage(this.userSelection);

    this.router.navigate(['/compare']);

    window.scrollTo(0, 0);

  }

  goBack(): void {

    this.router.navigate(['/']);

    window.scrollTo(0, 0);

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
    this.userSelection.clearResults();
  }

}
