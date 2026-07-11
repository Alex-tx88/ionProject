import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], 
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  
  dados = {
    email: '',
    senha: ''
  };

  lgpdAceito: boolean = false;
  podeAceitarLgpd: boolean = false;
  senhaOculta: boolean = true;
  erroLogin: boolean = false;
  
  // Controle do Modal
  mostrarModalPolitica: boolean = false;

  constructor(private router: Router) {}

  get loginValido(): boolean {
    return !!(this.dados.email && this.dados.senha && this.lgpdAceito);
  }
  
  abrirPolitica(event: Event) {
    event.preventDefault(); 
    this.mostrarModalPolitica = true; // Abre a janela da LGPD
  }

  fecharPolitica() {
    this.mostrarModalPolitica = false;
  }

  aceitarPoliticaModal() {
    this.podeAceitarLgpd = true; // Destrava o checkbox
    this.lgpdAceito = true;      // Já marca automático pro usuário
    this.fecharPolitica();       // Fecha a janela
  }

  entrar() {
    if (this.dados.email === 'admin@ion.com' && this.dados.senha === 'admin123') {
      this.erroLogin = false;
      sessionStorage.setItem('ion_session', 'true');
      this.router.navigate(['/dashboard']);
    } else {
      this.erroLogin = true; 
    }
  }

  alternarSenha() {
    this.senhaOculta = !this.senhaOculta;
  }
}