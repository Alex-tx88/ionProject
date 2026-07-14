import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LgpdModalComponent } from '../../shared/components/lgpd-modal/lgpd-modal.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LgpdModalComponent],
  templateUrl: './login.html',
  styleUrls: []
})
export class Login {
  
  private authService = inject(AuthService);

  dados = { email: '', senha: '' };
  
  senhaOculta: boolean = true;
  erroLogin: boolean = false;
  lgpdAceito: boolean = false;
  podeAceitarLgpd: boolean = false;
  mostrarModalPolitica: boolean = false;

  alternarSenha() {
    this.senhaOculta = !this.senhaOculta;
  }

  get loginValido(): boolean {
    return !!(this.dados.email && this.dados.senha && this.lgpdAceito);
  }

  entrar() {
    if (this.dados.email === 'admin@ion.com' && this.dados.senha === 'admin123') {
      this.erroLogin = false;
      this.authService.login();
    } else {
      this.erroLogin = true; 
    }
  }

  abrirPolitica(event: Event) {
    event.preventDefault();
    this.mostrarModalPolitica = true;
  }

  fecharPolitica() {
    this.mostrarModalPolitica = false;
  }

  aceitarPoliticaModal() {
    this.podeAceitarLgpd = true;
    this.lgpdAceito = true;
    this.mostrarModalPolitica = false;
  }
}