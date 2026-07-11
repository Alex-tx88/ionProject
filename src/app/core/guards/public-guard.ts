import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const isLogged = sessionStorage.getItem('ion_session') === 'true';

  if (isLogged) {
    // Se já está logado, não tem por que ver a tela de login. Joga pro Dashboard.
    router.navigate(['/dashboard']);
    return false; 
  } else {
    return true; // Se não está logado, a tela de login tá liberada.
  }
};