import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { Dashboard } from './pages/dashboard/dashboard';
import { Mapa } from './pages/mapa/mapa'; 

// Importando os Seguranças (Guards)
import { authGuard } from './core/guards/auth-guard';
import { publicGuard } from './core/guards/public-guard';

export const routes: Routes = [
  // Redirecionamento inicial
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // ==========================================
  // ROTAS PÚBLICAS (A pessoa só acessa se NÃO estiver logada)
  // ==========================================
  { path: 'login', component: Login, canActivate: [publicGuard] },
  { path: 'cadastro', component: Cadastro, canActivate: [publicGuard] },
  
  // ==========================================
  // ROTAS PRIVADAS (A pessoa SÓ acessa se tiver feito LOGIN)
  // ==========================================
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'mapa', component: Mapa, canActivate: [authGuard] },
  
  // Rota Coringa: Se digitar qualquer URL que não existe (ex: /teste), volta pro login
  { path: '**', redirectTo: '/login' }
];