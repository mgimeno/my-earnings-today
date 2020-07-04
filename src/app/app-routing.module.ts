import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyEarningsComponent } from './components/my-earnings/my-earnings.component';
import { CompareToolComponent } from './components/compare-tool/compare-tool.component';
import { AboutComponent } from './components/about/about.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', component: MyEarningsComponent, pathMatch: 'full' },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'compare', component: CompareToolComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
