import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LgpdModalComponent } from '../../shared/components/lgpd-modal/lgpd-modal.component';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LgpdModalComponent],
  templateUrl: './cadastro.html',
  styleUrls: []
})
export class Cadastro {
  
  private router = inject(Router);

  passo: number = 1;
  senhaOculta: boolean = true;
  confirmarSenhaOculta: boolean = true;
  
  lgpdAceito: boolean = false;
  podeAceitarLgpd: boolean = false;
  mostrarModalPolitica: boolean = false;

  dados = {
    nome: '', email: '', telefone: '', cpf: '',
    senha: '', confirmarSenha: ''
  };

  tipoVeiculoSelecionado: string = '';

  tiposVeiculo = [
    { id: 'eletrico', nome: '100% Elétrico', sub: 'Totalmente a bateria (BEV)', icon: 'bi-ev-front-fill' },
    { id: 'hibrido', nome: 'Híbrido', sub: 'Motor elétrico e combustão (PHEV/HEV)', icon: 'bi-car-front-fill' },
    { id: 'nenhum', nome: 'Ainda não possuo', sub: 'Quero apenas explorar a rede', icon: 'bi-bicycle' }
  ];

  // =========================================
  // LÓGICA DE MÁSCARAS (CPF E TELEFONE)
  // =========================================
  onCpfChange(valor: string) {
    let v = valor.replace(/\D/g, ''); // Remove tudo que não for número
    if (v.length > 11) v = v.substring(0, 11);
    
    if (v.length === 0) {
      this.dados.cpf = '';
    } else if (v.length <= 3) {
      this.dados.cpf = v;
    } else if (v.length <= 6) {
      this.dados.cpf = `${v.substring(0, 3)}.${v.substring(3)}`;
    } else if (v.length <= 9) {
      this.dados.cpf = `${v.substring(0, 3)}.${v.substring(3, 6)}.${v.substring(6)}`;
    } else {
      this.dados.cpf = `${v.substring(0, 3)}.${v.substring(3, 6)}.${v.substring(6, 9)}-${v.substring(9)}`;
    }
  }

  onTelefoneChange(valor: string) {
    let v = valor.replace(/\D/g, ''); // Remove tudo que não for número
    if (v.length > 11) v = v.substring(0, 11);
    
    if (v.length === 0) {
      this.dados.telefone = '';
    } else if (v.length <= 2) {
      this.dados.telefone = `(${v}`;
    } else if (v.length <= 7) { // (XX) XXXXX
      this.dados.telefone = `(${v.substring(0, 2)}) ${v.substring(2)}`;
    } else { // (XX) XXXXX-XXXX
      this.dados.telefone = `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7)}`;
    }
  }

  // =========================================
  // RESTANTE DOS CONTROLES DO COMPONENTE
  // =========================================
  alternarSenha(campo: 'senha' | 'confirmar') {
    if (campo === 'senha') {
      this.senhaOculta = !this.senhaOculta;
    } else {
      this.confirmarSenhaOculta = !this.confirmarSenhaOculta;
    }
  }

  selecionarTipoVeiculo(id: string) {
    this.tipoVeiculoSelecionado = id;
  }

  get passo1Valido(): boolean {
    return !!(this.dados.nome && this.dados.email && this.dados.telefone.length === 15 && this.dados.cpf.length === 14);
  }

  get passo2Valido(): boolean {
    const senhasConferem = this.dados.senha === this.dados.confirmarSenha;
    return !!(this.dados.senha && this.dados.confirmarSenha && senhasConferem && this.tipoVeiculoSelecionado && this.lgpdAceito);
  }

  avancar() {
    if (this.passo1Valido) this.passo = 2;
  }

  voltar() {
    this.passo = 1;
  }

  finalizar() {
    alert('Cadastro realizado com sucesso! Bem-vindo ao Íon.');
    this.router.navigate(['/login']);
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