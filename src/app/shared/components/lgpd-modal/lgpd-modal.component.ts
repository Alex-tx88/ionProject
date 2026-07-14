import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-lgpd-modal',
  standalone: true,
  template: `
  <div class="modal-overlay" role="dialog" aria-modal="true">
    <div class="modal-content-lgpd shadow-lg">
      
      <!-- HEADER DO MODAL (Botão X corrigido) -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="text-white fw-bold m-0 d-flex align-items-center">
          <i class="bi bi-shield-lock-fill text-neon me-2"></i> Política de Privacidade
        </h4>
        <button type="button" class="btn-close-modal" aria-label="Fechar" (click)="fechar.emit()">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      
      <!-- TEXTO COMPLETO RESTAURADO -->
      <div class="modal-body-lgpd text-muted-custom fs-7 pe-3">
        <p>A <strong>Íon Mobilidade</strong> tem o compromisso absoluto de proteger a sua privacidade. Garantimos que seus dados pessoais e informações de localização do veículo sejam processados em estrita conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).</p>
        
        <p>Os dados coletados — como seu nome, e-mail, modelo do veículo e histórico de rotas — são utilizados exclusivamente para otimizar sua experiência na busca por eletropostos, personalizar alertas de bateria e melhorar nossos serviços de mapeamento e disponibilidade na rede.</p>
        
        <p>Não compartilhamos, vendemos ou comercializamos suas informações com terceiros sem o seu consentimento prévio e explícito, exceto para cumprimento de obrigações legais, regulatórias ou ordens judiciais pertinentes.</p>
        
        <p>Você detém total controle sobre suas informações, tendo o direito de solicitar o acesso, a correção, a portabilidade ou a exclusão definitiva dos seus dados a qualquer momento, diretamente pelo aplicativo ou acessando o painel de configurações do seu perfil.</p>
      </div>
      
      <!-- BOTÃO DE ACEITAR -->
      <div class="mt-4 pt-3 border-top border-secondary border-opacity-25">
        <button type="button" class="btn btn-primary-custom w-100 py-3 fw-bold" (click)="aceitar.emit()">
          LI E ACEITO A POLÍTICA DE PRIVACIDADE
        </button>
      </div>

    </div>
  </div>
  `,
  styles: [`
    .modal-overlay { 
      position: fixed; inset: 0; background: rgba(11,17,20,0.85); backdrop-filter: blur(8px); 
      z-index: 9999; display: flex; align-items: center; justify-content: center; 
    }
    
    .modal-content-lgpd { 
      background-color: var(--ion-bg, #0b1114); border: 1px solid var(--ion-border, rgba(255,255,255,0.05)); 
      border-radius: 20px; width: 90%; max-width: 650px; padding: 30px; box-shadow: 0 15px 35px rgba(0,0,0,0.5); 
    }
    
    /* CORREÇÃO DO BOTÃO "X" */
    .btn-close-modal { 
      background: rgba(255,255,255,0.08); 
      color: #fff; 
      border-radius: 50%; 
      width: 36px; 
      height: 36px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      border: 1px solid transparent;
      padding: 0;
      cursor: pointer;
      transition: all 0.2s;
      flex-shrink: 0; /* Impede que o botão seja esmagado pelo título */
    }
    .btn-close-modal:hover { 
      background: rgba(255,77,77,0.15); 
      color: #ff4d4d;
      border-color: rgba(255,77,77,0.3);
      transform: rotate(90deg);
    }
    
    /* SCROLL PERSONALIZADO DA CAIXA DE TEXTO */
    .modal-body-lgpd { 
      max-height: 45vh; overflow-y: auto; text-align: justify; line-height: 1.6; 
    }
    .modal-body-lgpd::-webkit-scrollbar { width: 6px; }
    .modal-body-lgpd::-webkit-scrollbar-track { background: transparent; }
    .modal-body-lgpd::-webkit-scrollbar-thumb { background: rgba(0, 229, 155, 0.3); border-radius: 10px; }
    .modal-body-lgpd::-webkit-scrollbar-thumb:hover { background: rgba(0, 229, 155, 0.6); }
    .modal-body-lgpd p:last-child { margin-bottom: 0; }
  `]
})
export class LgpdModalComponent {
  @Output() fechar = new EventEmitter<void>();
  @Output() aceitar = new EventEmitter<void>();
}