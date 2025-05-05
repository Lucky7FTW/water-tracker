import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HydrationService } from './hydration.service';

/**
 * Functional guard (Angular 16+) that skips the
 * setup wizard when a daily goal already exists.
 */
export const goalGuard: CanActivateFn = () => {
  const hyd = inject(HydrationService);
  const router = inject(Router);

  if (hyd.goal()) {
    // goal exists → go straight to tracker
    router.navigateByUrl('/tracker');
    return false;
  }
  // no goal yet → allow navigation to /setup
  return true;
};
