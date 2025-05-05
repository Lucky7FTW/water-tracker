import { Routes } from '@angular/router';
import { goalGuard } from './core/goal.guard';

/**
 * Browser-side route table.
 * Stand-alone components are lazy-loaded with `loadComponent`.
 */
export const routes: Routes = [
  /* ───────────────────────────── default ─────────────────────────── */
  { path: '', redirectTo: 'setup', pathMatch: 'full' },

  /* ───────────────────────────── wizard ──────────────────────────── */
  {
    path: 'setup',
    loadComponent: () =>
      import('./features/setup/setup.component').then(m => m.SetupComponent),
    canActivate: [goalGuard]          // skip if a goal already exists
  },

  /* ───────────────────────────── tracker ─────────────────────────── */
  {
    path: 'tracker',
    loadComponent: () =>
      import('./features/tracker/tracker.component').then(m => m.TrackerComponent)
  },

  /* ───────────────────────────── wildcard ────────────────────────── */
  { path: '**', redirectTo: 'setup' }
];
