import { Routes } from '@angular/router';
import { goalGuard } from './core/goal.guard';

/* ───────── client + server can share this same array ───────── */
export const routes: Routes = [
  /* default */
  { path: '', redirectTo: 'setup', pathMatch: 'full' },

  /* one‑time wizard (auto‑skipped later by GoalGuard) */
  {
    path: 'setup',
    loadComponent: () =>
      import('./features/setup/setup.component').then(m => m.SetupComponent),
    canActivate: [goalGuard]
  },

  /* main tracker */
  {
    path: 'tracker',
    loadComponent: () =>
      import('./features/tracker/tracker.component').then(m => m.TrackerComponent)
  },

  /* NEW: settings page (always reachable) */
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/setup/setup.component').then(m => m.SetupComponent)
  },

  /* wildcard */
  { path: '**', redirectTo: 'tracker' }
];
