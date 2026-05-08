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
import { ActivatedRoute, Router } from '@angular/router';
import { UserSelection } from '../../shared/models/user-selection.model';
import { ShareService } from '../../shared/services/share.service';
import { StorageService } from '../../shared/services/storage-service';
import { CommonHelper } from '../../shared/utils/common-helper';
import { MyEarningsDetailsComponent } from '../my-earnings-details/my-earnings-details.component';
import { UserSelectionComponent } from '../user-selection/user-selection.component';

@Component({
  imports: [MatButtonModule, MatIconModule, MyEarningsDetailsComponent, UserSelectionComponent],
  templateUrl: './my-earnings.component.html',
  styleUrls: ['./my-earnings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyEarningsComponent implements OnDestroy {
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly shareService = inject(ShareService);
  private readonly storageService = inject(StorageService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  readonly showResults = signal(false);
  readonly userSelection = signal<UserSelection | null>(null);

  constructor() {
    this.setupOnParamsChange();

    this.loadInitialUserSelection();
  }

  private loadInitialUserSelection(): void {
    const personNumber = 1;

    if (this.storageService.hasUserSelectionOnURL(personNumber)) {
      this.userSelection.set(this.storageService.getUserSelectionFromURL(personNumber));
    } else if (this.storageService.hasUserSelectionOnLocalStorage(personNumber)) {
      this.userSelection.set(this.storageService.getUserSelectionFromLocalStorage(personNumber));
    } else {
      const userSelection = new UserSelection(personNumber);
      userSelection.setDefaultValues();
      this.userSelection.set(userSelection);
    }

    if (this.userSelection()?.canCalculate()) {
      this.calculate();
    }
  }

  private calculate(): void {
    const userSelection = this.userSelection();

    if (!userSelection) {
      return;
    }

    this.storageService.saveUserSelectionOnLocalStorage(userSelection);
    this.storageService.setUserSelectionOnURL(userSelection);

    userSelection.calculate();

    this.showResults.set(true);

    window.scrollTo(0, 0);
  }

  async tryCalculate(): Promise<void> {
    const userSelection = this.userSelection();

    if (!userSelection) {
      return;
    }

    if (userSelection.canCalculate()) {
      this.calculate();
    } else {
      const { UserSelectionValidationDialogComponent } =
        await import('../user-selection-validation-dialog/user-selection-validation-dialog.component');

      this.dialog.open(UserSelectionValidationDialogComponent, {
        data: { userSelections: [userSelection], isCompareTool: false },
        minWidth: 320,
      });
    }
  }

  goToCompare(): void {
    const userSelection = this.userSelection();

    if (userSelection) {
      this.storageService.saveUserSelectionOnLocalStorage(userSelection);
    }

    void this.router.navigate(['/compare']);

    window.scrollTo(0, 0);
  }

  goBack(): void {
    void this.router.navigate(['/']);

    window.scrollTo(0, 0);
  }

  async shareCurrentUrl(): Promise<void> {
    await this.shareService.shareCurrentUrl();
  }

  private setupOnParamsChange(): void {
    this.activeRoute.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((queryParams) => {
        if (!CommonHelper.isEmptyObject(queryParams)) {
          return;
        }

        this.userSelection()?.clearResults();
        this.showResults.set(false);
      });
  }

  ngOnDestroy(): void {
    this.userSelection()?.clearResults();
  }
}
