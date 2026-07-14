import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

  login() {
    sessionStorage.setItem('ion_session', 'true');
    this.router.navigate(['/dashboard']);
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return sessionStorage.getItem('ion_session') === 'true';
  }

  getUserInfo() {
    return { nome: 'Alex', iniciais: 'AL' }; 
  }
}