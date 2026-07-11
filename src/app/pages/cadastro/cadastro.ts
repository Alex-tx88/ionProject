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
    confirmarSenha: '',
    marca: '',   
    modelo: ''   
  };

  veiculoSelecionado: string = '';
  lgpdAceito: boolean = false;
  podeAceitarLgpd: boolean = false;
  
  senhaOculta: boolean = true;
  confirmarSenhaOculta: boolean = true;

  constructor(private router: Router) {}
  
  aplicarMascaraTelefone(valor: string) {
    valor = valor.replace(/\D/g, '');
    valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
    valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');
    this.dados.telefone = valor;
  }

  aplicarMascaraCPF(valor: string) {
    valor = valor.replace(/\D/g, '');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    this.dados.cpf = valor;
  }
  
  get passo1Valido(): boolean {
    return !!(this.dados.nome && this.dados.email && this.dados.telefone.length >= 14 && this.dados.cpf.length === 14);
  }

  get passo2Valido(): boolean {
    const carroValido = this.veiculoSelecionado === 'NONE' || 
                       (this.veiculoSelecionado !== '' && this.dados.marca && this.dados.modelo);

    return !!(this.dados.senha && this.dados.confirmarSenha && this.veiculoSelecionado && carroValido && this.lgpdAceito);
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
    if (tipo === 'NONE') {
      this.dados.marca = '';
      this.dados.modelo = '';
    }
  }

  abrirPolitica(event: Event) {
    event.preventDefault();
    this.podeAceitarLgpd = true;
    alert('Simulação: Abrindo o texto da Política de Privacidade...\n\nAgora o checkbox foi liberado para você marcar no seu cadastro.');
  }

  alternarSenha() {
    this.senhaOculta = !this.senhaOculta;
  }

  alternarConfirmarSenha() {
    this.confirmarSenhaOculta = !this.confirmarSenhaOculta;
  }

  finalizarCadastro() {

    alert("Cadastro realizado com sucesso! (Simulação)");
  }
}