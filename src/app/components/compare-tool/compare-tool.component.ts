import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IConfirmDialog } from '../../shared/intefaces/confirm-dialog.interface';
import { UserSelection } from '../../shared/models/user-selection.model';
import { StorageService } from '../../shared/services/storage-service';
import { CommonHelper } from '../../shared/utils/common-helper';
import { CompareToolDetailsComponent } from '../compare-tool-details/compare-tool-details.component';
import { UserSelectionComponent } from '../user-selection/user-selection.component';

@Component({
  imports: [
    CompareToolDetailsComponent,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    UserSelectionComponent,
  ],
  templateUrl: './compare-tool.component.html',
  styleUrls: ['./compare-tool.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompareToolComponent implements OnDestroy {
  private activeRoute = inject(ActivatedRoute);
  private bottomSheet = inject(MatBottomSheet);
  private storageService = inject(StorageService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  readonly userSelections = signal<UserSelection[]>([]);
  readonly showResults = signal(false);
  readonly activeTabIndex = signal(0);

  constructor() {
    this.setupOnParamsChange();

    this.loadInitialUserSelections();
  }

  private loadInitialUserSelections(): void {
    const userSelections = new Array<UserSelection>();

    for (let personNumber = 1; personNumber <= environment.compareToolMaxPersons; personNumber++) {
      if (this.storageService.hasUserSelectionOnURL(personNumber)) {
        const userSelection = this.storageService.getUserSelectionFromURL(personNumber);
        userSelections.push(userSelection);
      } else if (this.storageService.hasUserSelectionOnLocalStorage(personNumber)) {
        const userSelection = this.storageService.getUserSelectionFromLocalStorage(personNumber);
        userSelections.push(userSelection);
      }
    }

    this.userSelections.set(userSelections);

    if (this.canCalculate()) {
      this.calculate();
    } else if (this.userSelections().length === 0) {
      this.addPerson();
    } else if (this.userSelections().length === 1) {
      this.addPerson();
    }
  }

  private canCalculate(): boolean {
    const userSelections = this.userSelections();

    return (
      userSelections.length >= 2 &&
      userSelections.length ===
        userSelections.filter((us) => {
          return us.canCalculate();
        }).length
    );
  }

  private calculate(): void {
    const userSelections = this.userSelections();

    this.storageService.saveUserSelectionsOnLocalStorage(userSelections);
    this.storageService.setUserSelectionsOnURL(userSelections);

    userSelections.forEach((us) => {
      us.calculate();
    });
    this.showResults.set(true);
  }

  async tryCalculate(): Promise<void> {
    if (this.canCalculate()) {
      this.calculate();
    } else {
      const { UserSelectionValidationDialogComponent } =
        await import('../user-selection-validation-dialog/user-selection-validation-dialog.component');

      this.dialog.open(UserSelectionValidationDialogComponent, {
        data: { userSelections: this.userSelections(), isCompareTool: true },
        minWidth: 320,
      });
    }
  }

  addPerson(): void {
    window.scrollTo(0, 0);

    const personNumber = this.userSelections().length + 1;

    const newUserSelection = new UserSelection(personNumber);
    newUserSelection.setDefaultValues();

    this.userSelections.update((current) => [...current, newUserSelection]);
    this.activeTabIndex.set(personNumber - 1);
  }

  canAddMorePersons(): boolean {
    return this.userSelections().length < environment.compareToolMaxPersons;
  }

  async removePerson(event: MouseEvent, tabIndex: number): Promise<void> {
    event.stopPropagation();

    const { ConfirmDialogComponent } = await import('../confirm-dialog/confirm-dialog.component');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: <IConfirmDialog>{
        body: $localize`:@@compare-tool.remove-person-confirmation-text:Do you want to remove this person?`,
        cancelButtonText: $localize`:@@compare-tool.cancel:Cancel`,
        confirmButtonText: $localize`:@@compare-tool.remove:Remove`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          const nextSelections = this.userSelections().filter((_, index) => index !== tabIndex);
          this.userSelections.set(nextSelections);

          this.reorderUserSelections();

          this.activeTabIndex.set(this.userSelections()[tabIndex] ? tabIndex : tabIndex - 1);
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/compare']);

    window.scrollTo(0, 0);
  }

  async openShareBottomSheet(): Promise<void> {
    const { ShareBottomSheetComponent } =
      await import('../share-bottom-sheet/share-bottom-sheet.component');

    this.bottomSheet.open(ShareBottomSheetComponent);
  }

  private reorderUserSelections(): void {
    let personNumber = 1;

    const userSelections = this.userSelections();

    for (let index = 1; index < userSelections.length; index++) {
      personNumber++;

      const userSelection = userSelections[index];

      if (userSelection.personNumber !== personNumber) {
        if (
          userSelection.name ===
          `${$localize`:@@compare-tool.person:Person`} ${userSelection.personNumber}`
        ) {
          userSelection.name = `${$localize`:@@compare-tool.person:Person`} ${personNumber}`;
        }

        userSelection.personNumber = personNumber;
      }
    }
  }

  private clearAllIntervals(): void {
    this.userSelections().forEach((us) => {
      us.clearResults();
    });
  }

  private setupOnParamsChange(): void {
    this.activeRoute.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((queryParams) => {
        if (!CommonHelper.isEmptyObject(queryParams)) {
          return;
        }

        this.clearAllIntervals();
        this.showResults.set(false);
      });
  }

  ngOnDestroy(): void {
    this.clearAllIntervals();
  }
}
