export interface IConfirmDialog {
  title?: string;
  body?: string;
  cancelButtonText: string;
  confirmButtonText: string;
  confirmButtonIcon?: string;
  confirmButtonType?: 'danger' | 'primary';
}
