import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Verifica se o usuário tem a chave de sessão guardada
  const isLogged = sessionStorage.getItem('ion_session') === 'true';

  if (isLogged) {
    return true; // Liberado! Pode acessar a página.
  } else {
    // Barrado! Joga de volta para a tela de login.
    router.navigate(['/login']);
    return false;
  }
};