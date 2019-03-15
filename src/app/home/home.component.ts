import { Component, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatBottomSheet } from '@angular/material';
import { ShareBottomSheetComponent } from '../share-bottom-sheet/share-bottom-sheet.component';
import { UserSelection } from '../shared/models/user-selection.model';
import { StorageService } from '../shared/services/storage-service';
import { CommonHelper } from '../shared/helpers/common-helper';


@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnDestroy {

  showResults: boolean = false;

  userSelection: UserSelection = null;

  constructor(
    private activeRoute: ActivatedRoute,
    private bottomSheet: MatBottomSheet,
    private storageService: StorageService) {

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

  calculate(): void {

    this.storageService.saveUserSelectionOnLocalStorage(this.userSelection);
    this.storageService.setUserSelectionOnURL(this.userSelection);

    this.userSelection.calculate();

    this.showResults = true;

  }

  canCalculate(): boolean {
    return this.userSelection.canCalculate();
  }

  goToCompare(): void {

    this.userSelection.personNumber = 1;
    this.userSelection.name = "Person 1";

    this.storageService.cleanUserSelectionsOnLocalStorage();
    this.storageService.setUserSelectionsOnURL([this.userSelection]);
  }

  openShareBottomSheet(): void {
    this.bottomSheet.open(ShareBottomSheetComponent);
  }

  private setupOnParamsChange(): void {
    this.activeRoute.queryParams.subscribe(queryParams => {
      if (CommonHelper.isEmptyObject(queryParams)) {
        this.userSelection.clearUpdateCurrentAmountInterval();
        this.showResults = false;
      }
    });
  }

  ngOnDestroy(): void {
    console.log("Single User selection destroyed");
    this.userSelection.clearUpdateCurrentAmountInterval();
  }

}
