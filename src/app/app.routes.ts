import { Routes } from '@angular/router';
import { Login } from './pages/login/login'; 
import { Cadastro } from './pages/cadastro/cadastro'; 
import { Dashboard } from './pages/dashboard/dashboard'; 

import { authGuard } from './core/guards/auth-guard';
import { publicGuard } from './core/guards/public-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  { path: 'login', component: Login, canActivate: [publicGuard] },
  { path: 'cadastro', component: Cadastro, canActivate: [publicGuard] },
  
  { 
    path: 'dashboard', 
    component: Dashboard, 
    canActivate: [authGuard] 
  },
  
  { path: '**', redirectTo: 'login' }
];