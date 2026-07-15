import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { Dashboard } from './pages/dashboard/dashboard';
import { Mapa } from './pages/mapa/mapa';
import { authGuard } from './core/guards/auth-guard';
import { publicGuard } from './core/guards/public-guard';

export const routes: Routes = [
  { path: '', component: Landing, canActivate: [publicGuard] },
  { path: 'login', component: Login, canActivate: [publicGuard] },
  { path: 'cadastro', component: Cadastro, canActivate: [publicGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'mapa', component: Mapa, canActivate: [authGuard] },
  
  { path: '**', redirectTo: '' }
];