import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.css']
})
export class Cadastro {
  passoAtual: number = 1;

 
  dados = {
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    senha: '',
    confirmarSenha: ''
  };

  veiculoSelecionado: string = '';
  
 
  lgpdAceito: boolean = false;
  podeAceitarLgpd: boolean = false;

  constructor(private router: Router) {}

  get passo1Valido(): boolean {
    return !!(this.dados.nome && this.dados.email && this.dados.telefone && this.dados.cpf);
  }

  get passo2Valido(): boolean {
    return !!(this.dados.senha && this.dados.confirmarSenha && this.veiculoSelecionado && this.lgpdAceito);
  }

  proximoPasso() {
    if (this.passo1Valido) {
      this.passoAtual = 2;
    }
  }

  passoAnterior() {
    if (this.passoAtual === 2) {
      this.passoAtual = 1;
    }
  }

  selecionarVeiculo(tipo: string) {
    this.veiculoSelecionado = tipo;
  }

  abrirPolitica(event: Event) {
    event.preventDefault();
    this.podeAceitarLgpd = true;
    alert('Simulação: Abrindo o texto da Política de Privacidade...\n\nAgora o checkbox foi liberado para você marcar no seu cadastro.');
  }

  finalizarCadastro() {
    if (this.passo2Valido) {
      this.router.navigate(['/dashboard']);
    }
  }
}