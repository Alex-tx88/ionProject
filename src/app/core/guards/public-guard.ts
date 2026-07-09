import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLogado = localStorage.getItem('ion_session') === 'true';

  if (isLogado) {
    router.navigate(['/dashboard']); 
    return false; 
  } else {
    return true; 
  }
};