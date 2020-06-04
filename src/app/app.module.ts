import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ClipboardModule } from 'ngx-clipboard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyEarningsComponent } from './components/smart/my-earnings/my-earnings.component';
import { AboutComponent } from './components/smart/about/about.component';
import { ShareBottomSheetComponent } from './components/dumb/share-bottom-sheet/share-bottom-sheet.component';
import { PageNotFoundComponent } from './components/smart/page-not-found/page-not-found.component';
import { UserSelectionComponent } from './components/dumb/user-selection/user-selection.component';
import { CompareToolComponent } from './components/smart/compare-tool/compare-tool.component';
import { MyEarningsDetailsComponent } from './components/dumb/my-earnings-details/my-earnings-details.component';
import { CompareToolDetailsComponent } from './components/dumb/compare-tool-details/compare-tool-details.component';
import { UserSelectionValidationDialogComponent } from './components/dumb/user-selection-validation-dialog/user-selection-validation-dialog.component';
import { ConfirmDialogComponent } from './components/dumb/confirm-dialog/confirm-dialog.component';
import { CurrencyDirective } from './shared/directives/currency.directive';
import { SelectLanguageComponent } from './components/dumb/select-language/select-language.component';


@NgModule({
  declarations: [
    AppComponent,
    MyEarningsComponent,
    AboutComponent,
    ShareBottomSheetComponent,
    PageNotFoundComponent,
    UserSelectionComponent,
    CompareToolComponent,
    MyEarningsDetailsComponent,
    CompareToolDetailsComponent,
    UserSelectionValidationDialogComponent,
    ConfirmDialogComponent,
    CurrencyDirective,
    SelectLanguageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatBottomSheetModule,
    MatTabsModule,
    MatDialogModule,
    ClipboardModule
  ],
  entryComponents: [
    ShareBottomSheetComponent,
    UserSelectionValidationDialogComponent,
    ConfirmDialogComponent,
    SelectLanguageComponent
  ],
  providers: [{ provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { minWidth: 250, hasBackdrop: true } }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
