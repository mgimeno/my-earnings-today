import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatOptionModule,
  MatSelectModule, MatInputModule, MatIconModule, MatToolbarModule, MatSidenavModule,
  MatListModule, MatBottomSheetModule, MatTabsModule, MatGridListModule, MatTableModule, MatDialogModule
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyEarningsComponent } from './components/smart/my-earnings/my-earnings.component';
import { AboutComponent } from './components/smart/about/about.component';
import { ShareBottomSheetComponent } from './components/dumb/share-bottom-sheet/share-bottom-sheet.component';
import { PageNotFoundComponent } from './components/smart/page-not-found/page-not-found.component';
import { UserSelectionComponent } from './components/dumb/user-selection/user-selection.component';
import { CompareToolComponent } from './components/smart/compare-tool/compare-tool.component';
import { MyEarningsDetailsComponent } from './components/dumb/my-earnings-details/my-earnings-details.component';
import { CurrencyDisplayComponent } from './components/dumb/currency-display/currency-display.component';
import { CompareToolDetailsComponent } from './components/dumb/compare-tool-details/compare-tool-details.component';
import { UserSelectionValidationDialogComponent } from './components/dumb/user-selection-validation-dialog/user-selection-validation-dialog.component';


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
    CurrencyDisplayComponent,
    CompareToolDetailsComponent,
    UserSelectionValidationDialogComponent
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
    MatGridListModule,
    MatTableModule,
    MatDialogModule
  ],
  entryComponents: [ShareBottomSheetComponent, UserSelectionValidationDialogComponent ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
