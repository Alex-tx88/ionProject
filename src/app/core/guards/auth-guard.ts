import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isAuthenticated = sessionStorage.getItem('ion_session') === 'true';

  if (isAuthenticated) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};