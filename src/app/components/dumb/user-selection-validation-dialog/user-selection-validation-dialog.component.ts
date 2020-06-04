import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserSelection } from 'src/app/shared/models/user-selection.model';

@Component({
  templateUrl: './user-selection-validation-dialog.component.html',
  styleUrls: ['./user-selection-validation-dialog.component.scss']
})
export class UserSelectionValidationDialogComponent {

  constructor(public dialogRef: MatDialogRef<UserSelectionValidationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userSelections: UserSelection[], isCompareTool: boolean }) { }

  showName(): boolean {
    return this.data.isCompareTool;
  }

  getMinNumberOfUserSelectionsRequired(): number {
    return this.data.isCompareTool ? 2 : 1;
  }

  getName(userSelection: UserSelection): string {
    return (userSelection.hasName() ? userSelection.name : `${$localize`:@@person:Person`} ${userSelection.personNumber}`);
  }

  getValidationMessageForRate(userSelection: UserSelection): string {

    return (userSelection.personNumber > 1 ? $localize`:@@user-validation.type-how-much-they-earn:Type how much they earn` : $localize`:@@user-validation.type-how-much-you-earn:Type how much you earn`);

  }

  onClose(): void {
    this.dialogRef.close();
  }

}
