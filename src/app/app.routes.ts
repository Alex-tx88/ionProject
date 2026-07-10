import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { Dashboard } from './pages/dashboard/dashboard';
import { Mapa } from './pages/mapa/mapa'; // <-- Tem que ter essa importação!

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },
  { path: 'dashboard', component: Dashboard },
  { path: 'mapa', component: Mapa }, // <-- Tem que ter essa linha!
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];