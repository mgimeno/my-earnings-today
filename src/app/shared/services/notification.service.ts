import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  NotificationSnackbarComponent,
  NotificationSnackbarData,
} from '../components/notification-snackbar/notification-snackbar.component';

type NotificationType = NotificationSnackbarData['type'];

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.open(message, 'success');
  }

  error(message: string): void {
    this.open(message, 'error');
  }

  private open(message: string, type: NotificationType): void {
    this.snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: { message, type } satisfies NotificationSnackbarData,
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['app-snackbar', `app-snackbar-${type}`],
    });
  }
}
