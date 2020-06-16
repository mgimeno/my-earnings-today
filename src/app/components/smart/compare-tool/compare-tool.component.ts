import { Component, OnDestroy, ChangeDetectorRef, ViewRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/shared/services/storage-service';
import { UserSelection } from 'src/app/shared/models/user-selection.model';
import { ShareBottomSheetComponent } from '../../dumb/share-bottom-sheet/share-bottom-sheet.component';
import { CommonHelper } from 'src/app/shared/helpers/common-helper';
import { UserSelectionValidationDialogComponent } from '../../dumb/user-selection-validation-dialog/user-selection-validation-dialog.component';
import { IConfirmDialog } from 'src/app/shared/intefaces/confirm-dialog.interface';
import { ConfirmDialogComponent } from '../../dumb/confirm-dialog/confirm-dialog.component';

@Component({
  templateUrl: './compare-tool.component.html',
  styleUrls: ['./compare-tool.component.scss']
})
export class CompareToolComponent implements OnDestroy {

  userSelections: Array<UserSelection>;
  showResults: boolean = false;
  activeTabIndex: number = 0;

  constructor(
    private activeRoute: ActivatedRoute,
    private bottomSheet: MatBottomSheet,
    private storageService: StorageService,
    private dialog: MatDialog,
    private router: Router,
    private cdr: ChangeDetectorRef) {

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
    else if (this.userSelections.length === 0) {
      this.addPerson();
    }
    else if (this.userSelections.length === 1) {
      setTimeout(() => {
        this.addPerson();
      }, 500);

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
      this.dialog.open(UserSelectionValidationDialogComponent, {
        data: { userSelections: this.userSelections, isCompareTool: true },
        minWidth: 320
      });
    }
  }

  addPerson(): void {
    window.scrollTo(0, 0);

    let personNumber = (this.userSelections.length + 1);

    let newUserSelection = new UserSelection(personNumber);
    newUserSelection.setDefaultValues();

    this.userSelections.push(newUserSelection);

    this.activeTabIndex = (personNumber - 1);

    if (this.userSelections.length > 1 && !(this.cdr as ViewRef).destroyed) {
      this.cdr.detectChanges();
    }



    this.scrollTabHeadersToTheFarRight();

  }

  canAddMorePersons(): boolean {
    return this.userSelections.length < environment.compareToolMaxPersons;
  }

  removePerson(event: MouseEvent, tabIndex: number): void {
    event.stopPropagation();

    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: <IConfirmDialog>{
        body: $localize`:@@compare-tool.remove-person-confirmation-text:Do you want to remove this person?`,
        cancelButtonText: $localize`:@@compare-tool.cancel:Cancel`,
        confirmButtonText: $localize`:@@compare-tool.remove:Remove`
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.userSelections.splice(tabIndex, 1);

        this.reorderUserSelections();

        this.activeTabIndex = (this.userSelections[tabIndex] ? tabIndex : (tabIndex - 1));
      }
    });
  }

  goBack(): void {

    this.router.navigate(['/compare']);

    window.scrollTo(0, 0);

  }

  openShareBottomSheet(): void {
    this.bottomSheet.open(ShareBottomSheetComponent);
  }


  private reorderUserSelections(): void {

    let personNumber = 1;

    for (let index = 1; index < this.userSelections.length; index++) {

      personNumber++;

      let userSelection = this.userSelections[index];

      if (userSelection.personNumber != personNumber) {

        if (userSelection.name === `${$localize`:@@compare-tool.person:Person`} ${userSelection.personNumber}`) {
          userSelection.name = `${$localize`:@@compare-tool.person:Person`} ${personNumber}`;
        }

        userSelection.personNumber = personNumber;
      }

    }

  }


  private clearAllIntervals(): void {
    console.log("Compare tool selections destroyed");
    if (this.userSelections && this.userSelections.length) {
      this.userSelections.forEach(us => { us.clearResults(); });
    }
  }

  private setupOnParamsChange(): void {
    this.activeRoute.queryParams.subscribe(queryParams => {
      if (CommonHelper.isEmptyObject(queryParams)) {
        this.clearAllIntervals();
        this.showResults = false;
      }
    });
  }

  private scrollTabHeadersToTheFarRight(): void {
    setTimeout(() => {
      const element = document.querySelector(".mat-tab-header-pagination-after") as any;

      for (let i = 0; i < 6; i++) {
        element.click();
      }


    }, 50);
  }

  ngOnDestroy(): void {
    this.clearAllIntervals();
  }

}
