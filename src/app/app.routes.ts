import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/my-earnings/my-earnings.component').then((m) => m.MyEarningsComponent),
  },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  {
    path: 'compare',
    loadComponent: () =>
      import('./components/compare-tool/compare-tool.component').then(
        (m) => m.CompareToolComponent,
      ),
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component').then((m) => m.AboutComponent),
  },
  { path: '**', redirectTo: '' },
];
