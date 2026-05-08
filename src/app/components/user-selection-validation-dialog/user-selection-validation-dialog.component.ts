import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { UserSelection } from '../../shared/models/user-selection.model';

@Component({
  imports: [MatButtonModule, MatDialogActions, MatDialogContent, MatDialogTitle, MatIconModule],
  templateUrl: './user-selection-validation-dialog.component.html',
  styleUrls: ['./user-selection-validation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSelectionValidationDialogComponent {
  private readonly dialogRef =
    inject<MatDialogRef<UserSelectionValidationDialogComponent>>(MatDialogRef);
  readonly data = inject<{
    userSelections: UserSelection[];
    isCompareTool: boolean;
  }>(MAT_DIALOG_DATA);
  readonly showName = this.data.isCompareTool;
  readonly minNumberOfUserSelectionsRequired = this.data.isCompareTool ? 2 : 1;

  getName(userSelection: UserSelection): string {
    return userSelection.hasName()
      ? userSelection.name
      : `${$localize`:@@person:Person`} ${userSelection.personNumber}`;
  }

  getValidationMessageForRate(userSelection: UserSelection): string {
    return userSelection.personNumber > 1
      ? $localize`:@@user-validation.type-how-much-they-earn:Type how much they earn`
      : $localize`:@@user-validation.type-how-much-you-earn:Type how much you earn`;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
