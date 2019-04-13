import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserSelection } from 'src/app/shared/models/user-selection.model';

@Component({
  templateUrl: './user-selection-validation-dialog.component.html',
  styleUrls: ['./user-selection-validation-dialog.component.scss']
})
export class UserSelectionValidationDialogComponent {

  constructor(public dialogRef: MatDialogRef<UserSelectionValidationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public userSelections: UserSelection[]) { }

  showName(): boolean {
    return this.userSelections.length > 1;
  }

  getMinNumberOfUserSelectionsRequired(): number {
    return this.userSelections.length === 1 && !this.userSelections[0].personNumber ? 1 : 2;
  }

  getName(userSelection: UserSelection): string {
    return (userSelection.hasName() ? userSelection.name : `Person ${userSelection.personNumber}`);
  }

  getValidationMessageForRate(userSelection: UserSelection): string {
    return `Type how much ${(userSelection.personNumber > 1 ? "they" : "you")} earn`;
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
