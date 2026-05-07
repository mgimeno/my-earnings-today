import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AboutComponent } from "./components/about/about.component";
import { CompareToolComponent } from "./components/compare-tool/compare-tool.component";
import { MyEarningsComponent } from "./components/my-earnings/my-earnings.component";

const routes: Routes = [
  { path: "", component: MyEarningsComponent, pathMatch: "full" },
  { path: "home", redirectTo: "", pathMatch: "full" },
  { path: "compare", component: CompareToolComponent },
  { path: "about", component: AboutComponent },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
