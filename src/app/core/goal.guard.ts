/* ────────────────────────────────────────────────────────────
   src/app/core/goal.guard.ts
   Redirect users to /tracker only if today’s goal is present
   ────────────────────────────────────────────────────────── */
   import { inject } from '@angular/core';
   import { CanActivateFn, Router } from '@angular/router';
   import { HydrationService } from './hydration.service';
   
   /**
    * • If a goal for *today* already exists → skip wizard, go to /tracker.
    * • Otherwise → allow navigation to /setup (or /settings when user taps the gear).
    */
   export const goalGuard: CanActivateFn = () => {
     const hyd    = inject(HydrationService);   // singleton with date‑scoped keys
     const router = inject(Router);
   
     if (hyd.goal()) {                          // signal read → Goal | null
       router.navigateByUrl('/tracker');
       return false;                            // block /setup
     }
   
     return true;                               // show wizard
   };
   