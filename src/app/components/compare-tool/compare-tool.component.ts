import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { AppConstants } from '../../shared/constants/app.constant';
import { IConfirmDialog } from '../../shared/intefaces/confirm-dialog.interface';
import { UserSelection } from '../../shared/models/user-selection.model';
import { ShareService } from '../../shared/services/share.service';
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
    MatTooltipModule,
    UserSelectionComponent,
  ],
  templateUrl: './compare-tool.component.html',
  styleUrls: ['./compare-tool.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompareToolComponent implements OnDestroy {
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly storageService = inject(StorageService);
  private readonly shareService = inject(ShareService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly userSelections = signal<UserSelection[]>([]);
  readonly showResults = signal(false);
  readonly activeTabIndex = signal(0);

  constructor() {
    this.setupOnParamsChange();

    this.loadInitialUserSelections();
  }

  private loadInitialUserSelections(): void {
    const userSelections: UserSelection[] = [];

    for (
      let personNumber = 1;
      personNumber <= AppConstants.Common.COMPARE_TOOL_MAX_PERSONS;
      personNumber++
    ) {
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
    } else if (this.userSelections().length < 2) {
      this.addPerson();
    }
  }

  private canCalculate(): boolean {
    const userSelections = this.userSelections();

    return (
      userSelections.length >= 2 &&
      userSelections.every((userSelection) => userSelection.canCalculate())
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
    return this.userSelections().length < AppConstants.Common.COMPARE_TOOL_MAX_PERSONS;
  }

  async removePerson(event: MouseEvent, tabIndex: number): Promise<void> {
    event.stopPropagation();

    const { ConfirmDialogComponent } = await import('../confirm-dialog/confirm-dialog.component');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: $localize`:@@compare-tool.remove-person:Remove person`,
        body: $localize`:@@compare-tool.remove-person-confirmation-text:Do you want to remove this person?`,
        cancelButtonText: $localize`:@@compare-tool.cancel:Cancel`,
        confirmButtonText: $localize`:@@compare-tool.remove:Remove`,
        confirmButtonIcon: 'delete',
        confirmButtonType: 'danger',
      } as IConfirmDialog,
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
    void this.router.navigate(['/compare']);

    window.scrollTo(0, 0);
  }

  async shareCurrentUrl(): Promise<void> {
    await this.shareService.shareCurrentUrl();
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
