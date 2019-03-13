import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatOptionModule,
  MatSelectModule, MatInputModule, MatIconModule, MatToolbarModule, MatSidenavModule,
  MatListModule, MatBottomSheetModule, MatTabsModule, MatGridListModule
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ShareBottomSheetComponent } from './share-bottom-sheet/share-bottom-sheet.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserSelectionComponent } from './user-selection/user-selection.component';
import { CompareToolComponent } from './compare-tool/compare-tool.component';
import { MyEarningsDetailsComponent } from './my-earnings-details/my-earnings-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ShareBottomSheetComponent,
    PageNotFoundComponent,
    UserSelectionComponent,
    CompareToolComponent,
    MyEarningsDetailsComponent
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
    MatGridListModule
  ],
  entryComponents: [ShareBottomSheetComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
