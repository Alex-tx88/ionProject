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

  constructor(private router: Router) {}

  
  get loginValido(): boolean {
    return !!(this.dados.email && this.dados.senha && this.lgpdAceito);
  }
  
  abrirPolitica(event: Event) {
    event.preventDefault(); 
    this.podeAceitarLgpd = true; 
    alert('Simulação: Abrindo o texto da Política de Privacidade...\n\nAgora o checkbox foi liberado para você marcar.');
  }

  entrar() {
    if (this.loginValido) {
      sessionStorage.setItem('ion_session', 'true');
      this.router.navigate(['/dashboard']);
    }
  }

alternarSenha() {
  this.senhaOculta = !this.senhaOculta;
}
}