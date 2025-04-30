import { CanActivateFn } from '@angular/router';

export const goalGuard: CanActivateFn = (route, state) => {
  return true;
};
