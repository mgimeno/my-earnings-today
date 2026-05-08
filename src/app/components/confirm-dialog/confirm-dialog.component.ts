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
import { IConfirmDialog } from '../../shared/interfaces/confirm-dialog.interface';

@Component({
  imports: [MatButtonModule, MatDialogActions, MatDialogContent, MatDialogTitle, MatIconModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  private readonly dialogRef = inject<MatDialogRef<ConfirmDialogComponent>>(MatDialogRef);
  readonly data = inject<IConfirmDialog>(MAT_DIALOG_DATA);
  readonly confirmButtonType = this.data.confirmButtonType ?? 'primary';
  readonly confirmButtonIcon = this.data.confirmButtonIcon ?? 'check_circle';
  readonly actionBackgroundColor =
    this.confirmButtonType === 'danger' ? 'var(--danger-color)' : 'var(--primary-color)';

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
