import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EstacaoService } from '../../core/services/estacao';
import { AuthService } from '../../core/services/auth.service';
import { EstacaoProcessada, Notificacao, Veiculo } from '../../core/models/estacao.model';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  
  // Injeções Modernas do Angular
  private router = inject(Router);
  private estacaoService = inject(EstacaoService);
  private authService = inject(AuthService);

  // Dados do Usuário Centralizados
  usuario = this.authService.getUserInfo();

  // Variáveis de Estado da Interface
  dataAtualFormatada: string = '';
  mostrarNotificacoes: boolean = false;
  mostrarTodos: boolean = false;

  // Métricas do Dashboard
  totalEstacoes: number = 0;
  estacoesRaio5km: number = 0;
  shoppings: number = 0;
  redeRapidaDC: number = 0;

  // Coleções de Dados (Tipagem Refatorada)
  todosOsPostos: EstacaoProcessada[] = [];
  postosExibidos: EstacaoProcessada[] = [];
  
  veiculoAtual: Veiculo = {
    marca: 'Ford',
    modelo: 'Mustang Mach-E',
    conectores: ['Tipo 2', 'CCS2']
  };

  notificacoes: Notificacao[] = [
    { titulo: 'Novo posto adicionado', mensagem: 'O Íon mapeou uma nova estação perto do Salvador Shopping.', tempo: 'Há 10 min', lida: false },
    { titulo: 'Bateria ideal', mensagem: 'Agende a revisão programada do seu veículo na concessionária Ford.', tempo: 'Há 2h', lida: false },
    { titulo: 'Bem-vindo ao Íon', mensagem: 'Seu perfil foi configurado com sucesso.', tempo: 'Ontem', lida: true }
  ];

  // Coordenadas de Fallback (Centro de Salvador)
  private latUsuario: number = -12.9714; 
  private lonUsuario: number = -38.5104;

  ngOnInit(): void {
    this.atualizarData();
    this.processarEstacoes(); 
    this.buscarLocalizacaoReal(); 
  }

  private atualizarData(): void {
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    const data = new Date();
    this.dataAtualFormatada = `${diasSemana[data.getDay()]}, ${String(data.getDate()).padStart(2, '0')} ${meses[data.getMonth()]} ${data.getFullYear()}`;
  }

  get notificacoesNaoLidas(): number {
    return this.notificacoes.filter(n => !n.lida).length;
  }

  toggleNotificacoes(): void {
    this.mostrarNotificacoes = !this.mostrarNotificacoes;
  }

  marcarComoLidas(): void {
    this.notificacoes.forEach(n => n.lida = true);
  }

  private buscarLocalizacaoReal(): void {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.latUsuario = position.coords.latitude;
        this.lonUsuario = position.coords.longitude;
        this.processarEstacoes(); 
      },
      () => {
        console.warn('GPS bloqueado/indisponível. Fallback para coordenadas padrão.');
        this.processarEstacoes(); 
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 }
    );
  }

  private processarEstacoes(): void {
    const postosBrutos = this.estacaoService.getEstacoes();
    this.totalEstacoes = postosBrutos.length;

    // Processamento com a interface EstacaoProcessada para evitar conflitos
    const postosProcessados: EstacaoProcessada[] = postosBrutos.map(posto => {
      const distanciaKm = this.estacaoService.calcularDistancia(this.latUsuario, this.lonUsuario, posto.lat, posto.lon);
      
      let tag = 'Público';
      let tagColor = 'text-neon';
      
      if (posto.isShopping) { tag = 'Shopping'; tagColor = 'text-purple'; }
      else if (posto.isFast) { tag = 'Carga Rápida'; tagColor = 'text-blue'; }

      return {
        ...posto,
        distanciaNum: distanciaKm,
        distancia: distanciaKm.toFixed(1), 
        tag: tag,
        tagColor: tagColor
      };
    });

    this.estacoesRaio5km = postosProcessados.filter(p => p.distanciaNum <= 5).length;
    this.shoppings = postosProcessados.filter(p => p.isShopping).length;
    this.redeRapidaDC = postosProcessados.filter(p => p.isFast).length;

    // Ordenação por distância mais próxima
    this.todosOsPostos = postosProcessados.sort((a, b) => a.distanciaNum - b.distanciaNum);
    this.atualizarListaExibida();
  }

  alternarVerTodos(event: Event): void {
    event.preventDefault();
    this.mostrarTodos = !this.mostrarTodos;
    this.atualizarListaExibida();
  }

  private atualizarListaExibida(): void {
    this.postosExibidos = this.mostrarTodos ? this.todosOsPostos : this.todosOsPostos.slice(0, 3);
  }

  abrirMapa(): void {
    this.router.navigate(['/mapa']);
  }

  abrirNoMapa(nomeDoPosto: string): void {
    // CORRIGIDO: Enviando o parâmetro 'posto' na URL para o mapa capturar
    this.router.navigate(['/mapa'], { queryParams: { posto: nomeDoPosto } });
  }
  
  sair(): void {
    if (confirm('Tem certeza que deseja sair do Íon?')) {
      this.authService.logout();
    }
  }
}