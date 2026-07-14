import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  template: `
  <aside class="sidebar d-flex flex-row flex-md-column py-0 py-md-4 flex-shrink-0 z-3 shadow-lg">
    
    <div class="brand-icon mb-5 align-items-center gap-3 px-4 w-100 d-none d-md-flex">
      <i class="bi bi-lightning-charge-fill fs-3 text-neon ion-glow"></i>
      <span class="fs-4 fw-bold text-white tracking-wider">ÍON</span>
    </div>
    
    <nav class="nav-menu d-flex flex-row flex-md-column gap-0 gap-md-2 w-100 px-0 px-md-3 mt-0 mt-md-2 flex-grow-1">
      
      <a routerLink="/dashboard" routerLinkActive="active" class="nav-link custom-nav-link d-flex align-items-center justify-content-center justify-content-md-start gap-3 px-0 px-md-3 py-3 rounded-3 text-decoration-none">
        <i class="bi bi-house-door fs-5"></i><span class="fw-semibold d-none d-md-block">Início</span>
      </a>
      
      <a routerLink="/mapa" routerLinkActive="active" class="nav-link custom-nav-link d-flex align-items-center justify-content-center justify-content-md-start gap-3 px-0 px-md-3 py-3 rounded-3 text-decoration-none">
        <i class="bi bi-map fs-5"></i><span class="fw-semibold d-none d-md-block">Mapa</span>
      </a>

      <a href="javascript:void(0)" class="nav-link custom-nav-link d-flex align-items-center justify-content-center justify-content-md-start gap-3 px-0 px-md-3 py-3 rounded-3 text-decoration-none">
        <i class="bi bi-car-front fs-5"></i><span class="fw-semibold d-none d-md-block">Meus Veículos</span>
      </a>

      <a href="javascript:void(0)" class="nav-link custom-nav-link d-flex align-items-center justify-content-center justify-content-md-start gap-3 px-0 px-md-3 py-3 rounded-3 text-decoration-none">
        <i class="bi bi-people fs-5"></i><span class="fw-semibold d-none d-md-block">Comunidade</span>
      </a>

      <button type="button" class="nav-link custom-nav-link btn-logout d-flex align-items-center justify-content-center justify-content-md-start gap-3 px-0 px-md-3 py-3 rounded-3 mt-0 mt-md-auto text-decoration-none border-0 bg-transparent text-start" (click)="sair()">
        <i class="bi bi-box-arrow-right fs-5"></i><span class="fw-semibold d-none d-md-block">Sair</span>
      </button>

    </nav>
  </aside>
  `,
  styles: [`
    /* ========================================= */
    /* LAYOUT DESKTOP                            */
    /* ========================================= */
    .sidebar { 
      width: 240px; 
      border-right: 1px solid var(--ion-border, rgba(255,255,255,0.05)); 
      background-color: var(--ion-bg, #0b1114); 
      height: 100vh; 
      position: sticky; 
      top: 0;
    }
    .ion-glow { filter: drop-shadow(0 0 10px rgba(0, 229, 155, 0.4)); }
    .custom-nav-link { color: var(--ion-muted, #8b95a1); transition: all 0.2s; cursor: pointer; }
    .custom-nav-link:hover { background-color: rgba(255,255,255,0.05); color: #fff; }
    .nav-link.active { background: rgba(0, 229, 155, 0.1); color: var(--ion-neon, #00e59b); border-left: 3px solid var(--ion-neon, #00e59b); }
    .btn-logout:hover { background-color: rgba(255,77,77,0.1); color: #ff4d4d; border-left: 3px solid #ff4d4d; }
    
    /* ========================================= */
    /* BLINDAGEM ABSOLUTA PARA CELULAR           */
    /* ========================================= */
    @media (max-width: 768px) {
      .sidebar { 
        width: 100vw !important; 
        height: 70px !important; 
        position: fixed !important; 
        bottom: 0 !important; 
        left: 0 !important; 
        top: auto !important; 
        border-right: none !important;
        border-top: 1px solid var(--ion-border, rgba(255,255,255,0.05)) !important;
        background-color: rgba(11, 17, 20, 0.98) !important;
        backdrop-filter: blur(10px);
        z-index: 9999 !important; 
        padding: 0 !important; 
      }
      
      .nav-menu { 
        justify-content: space-around !important; 
        align-items: center !important; 
        height: 100% !important;
      }
      
      .custom-nav-link { 
        width: auto !important; 
        flex: 1 !important; 
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 0 !important; 
        margin: 0 !important;
        border: none !important; /* Remove bordas bagunçadas */
        border-radius: 0 !important;
        height: 100% !important;
        background: transparent !important;
      }

      /* UX MOBILE: A barra ativa fica embaixo, e não do lado */
      .nav-link.active { 
        border-left: none !important;
        border-bottom: 3px solid var(--ion-neon, #00e59b) !important;
        background: rgba(0, 229, 155, 0.05) !important;
      }

      .custom-nav-link i { 
        margin: 0 !important;
        font-size: 1.4rem !important; 
      }
    }
  `]
})
export class SidebarComponent {
  authService = inject(AuthService);
  sair() { if (confirm('Sair do Íon?')) this.authService.logout(); }
}