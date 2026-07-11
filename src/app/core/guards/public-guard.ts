import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const publicGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isAuthenticated = sessionStorage.getItem('ion_session') === 'true';

  if (isAuthenticated) {
    router.navigate(['/dashboard']);
    return false; 
  }
  
  return true;
};