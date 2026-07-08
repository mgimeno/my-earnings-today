import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/my-earnings/my-earnings.component').then((m) => m.MyEarningsComponent),
    data: { preload: true, preloadPriority: 30 },
  },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  {
    path: 'compare',
    loadComponent: () =>
      import('./components/compare-tool/compare-tool.component').then(
        (m) => m.CompareToolComponent,
      ),
    data: { preload: true, preloadPriority: 20 },
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component').then((m) => m.AboutComponent),
    data: { preload: true, preloadPriority: 10 },
  },
  { path: '**', redirectTo: '' },
];
