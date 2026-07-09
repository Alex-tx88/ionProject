import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLogado = localStorage.getItem('ion_session') === 'true';

  if (isLogado) {
    return true; 
  } else {
    router.navigate(['/login']); 
    return false; 
  }
};