import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

export interface NotificationSnackbarData {
  message: string;
  type: 'success' | 'error';
}

@Component({
  selector: 'app-notification-snackbar',
  imports: [MatIconModule],
  templateUrl: './notification-snackbar.component.html',
  styleUrls: ['./notification-snackbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationSnackbarComponent {
  readonly data = inject<NotificationSnackbarData>(MAT_SNACK_BAR_DATA);
  readonly icon = this.data.type === 'success' ? 'check_circle' : 'error';
}
