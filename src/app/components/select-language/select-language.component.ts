import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import type { SupportedLanguageCode } from '../../shared/utils/language-helper';

interface SelectLanguageData {
  currentLanguageCode: SupportedLanguageCode;
}

@Component({
  imports: [MatButtonModule],
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectLanguageComponent {
  private readonly bottomSheetRef =
    inject<MatBottomSheetRef<SelectLanguageComponent>>(MatBottomSheetRef);
  private readonly data = inject<SelectLanguageData>(MAT_BOTTOM_SHEET_DATA);

  readonly currentLanguageCode = this.data.currentLanguageCode;

  isActiveLanguage(languageCode: SupportedLanguageCode): boolean {
    return languageCode === this.currentLanguageCode;
  }

  selectLanguage(languageCode: SupportedLanguageCode): void {
    this.bottomSheetRef.dismiss(languageCode);
  }
}
