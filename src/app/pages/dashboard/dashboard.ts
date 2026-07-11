import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  totalEstacoes: number = 0;
  estacoesRaio5km: number = 0;
  shoppings: number = 0;
  redeRapidaDC: number = 0;

  todosOsPostos: any[] = [];
  postosExibidos: any[] = [];
  mostrarTodos: boolean = false;

  veiculoAtual = {
    marca: 'Ford',
    modelo: 'Mustang Mach-E',
    conectores: ['Tipo 2', 'CCS2']
  };

  // ==========================================
  // SISTEMA DE NOTIFICAÇÕES
  // ==========================================
  mostrarNotificacoes: boolean = false;
  notificacoes = [
    { titulo: 'Novo posto adicionado', mensagem: 'O Íon mapeou uma nova estação perto do Salvador Shopping.', tempo: 'Há 10 min', lida: false },
    { titulo: 'Bateria ideal', mensagem: 'Agende a revisão programada do seu veículo na concessionária Ford.' , tempo: 'Há 2h', lida: false },
    { titulo: 'Bem-vindo ao Íon', mensagem: 'Seu perfil foi configurado com sucesso.', tempo: 'Ontem', lida: true }
  ];

 // Localização do Campus do SENAI Cimatec (Fallback de Segurança)
  private latUsuario = -12.93815293615882; 
  private lonUsuario = -38.387176444288;

  // Banco de Dados com GPS de alta precisão
  private postosSalvador = [
    { lat: -12.977049863575994, lon: -38.45523139478341, nome: 'Eletroposto Salvador Shopping', endereco: 'Av. Tancredo Neves, 3133', isShopping: true, isFast: false },
    { lat: -12.981060367578994, lon: -38.464886730568125, nome: 'Recarga Shopping da Bahia', endereco: 'Av. Tancredo Neves, 148', isShopping: true, isFast: true },
    { lat: -13.006866204557813, lon: -38.52539175294331, nome: 'Tupinambá Shopping Barra', endereco: 'Av. Centenário, 2992', isShopping: true, isFast: false },
    { lat: -12.935662659926377, lon: -38.39478408824208, nome: 'Eletroposto Shopping Paralela', endereco: 'Av. Luís Viana Filho, 8544', isShopping: true, isFast: false },
    { lat: -12.887350713571314, lon: -38.31854761004745, nome: 'EZVolt Parque Shopping Bahia', endereco: 'R. Maria Tavares de Resende, 82', isShopping: true, isFast: true },
    { lat: -12.91547265239023, lon: -38.33508930543007, nome: 'Neoenergia Aeroporto', endereco: 'Praça Gago Coutinho, s/n', isShopping: false, isFast: true },
    { lat: -12.976565596401521, lon: -38.470048690383194, nome: 'Concessionária BYD Eurovia', endereco: 'Av. Antônio Carlos Magalhães, 3213', isShopping: false, isFast: true },
    { lat: -12.964267, lon: -38.472772, nome: 'GWM Morena Veículos', endereco: 'Av. Barros Reis, 1876', isShopping: false, isFast: true }, // Mantido da lista anterior
    { lat: -13.006795748195456, lon: -38.49289286125157, nome: 'Hospital Mater Dei', endereco: 'Rio Vermelho / Vasco da Gama', isShopping: false, isFast: false },
    { lat: -12.97598727410513, lon: -38.51365722077102, nome: 'Fera Palace Hotel', endereco: 'R. Chile, 20', isShopping: false, isFast: false },
    { lat: -12.988091802574289, lon: -38.44843652743008, nome: 'Pão de Açúcar Costa Azul', endereco: 'R. Arthur de Azevêdo Machado, 1475', isShopping: false, isFast: false },
    { lat: -12.93815293615882, lon: -38.387176444288, nome: 'Senai Cimatec', endereco: 'Av. Orlando Gomes, 1845', isShopping: false, isFast: true },
    { lat: -12.824732790786019, lon: -38.26757339008946, nome: 'Outlet Premium Salvador', endereco: 'Estrada do Coco, Camaçari', isShopping: true, isFast: true },
    { lat: -12.970573485539708, lon: -38.48104656125183, nome: 'Assaí Atacadista Rótula', endereco: 'Rótula do Abacaxi', isShopping: false, isFast: false }
  ];

  constructor(private router: Router, private zone: NgZone) {}

  ngOnInit(): void {
    this.processarEstacoes();
    this.buscarLocalizacaoReal();
  }

  // ==== Funções de Notificação ====
  get notificacoesNaoLidas() {
    return this.notificacoes.filter(n => !n.lida).length;
  }

  toggleNotificacoes() {
    this.mostrarNotificacoes = !this.mostrarNotificacoes;
  }

  marcarComoLidas() {
    this.notificacoes.forEach(n => n.lida = true);
  }

  // ==== Restante do Código ====
  private buscarLocalizacaoReal(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.zone.run(() => {
            this.latUsuario = position.coords.latitude;
            this.lonUsuario = position.coords.longitude;
            this.processarEstacoes(); 
          });
        },
        (error) => {
          this.zone.run(() => {
            console.warn('GPS não funcionou, usando fallback Cimatec.');
          });
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 }
      );
    }
  }

  private processarEstacoes(): void {
    this.totalEstacoes = this.postosSalvador.length;

    const postosProcessados = this.postosSalvador.map((posto: any) => {
      const distanciaKm = this.calcularDistancia(this.latUsuario, this.lonUsuario, posto.lat, posto.lon);
      
      let tag = 'Público';
      let tagColor = 'text-neon';
      if (posto.isShopping) { tag = 'Shopping'; tagColor = 'text-purple'; }
      else if (posto.isFast) { tag = 'Carga Rápida'; tagColor = 'text-blue'; }

      return {
        nome: posto.nome,
        endereco: posto.endereco,
        distanciaNum: distanciaKm,
        distancia: distanciaKm.toFixed(1), 
        tag: tag,
        tagColor: tagColor
      };
    });

    this.estacoesRaio5km = postosProcessados.filter((p: any) => p.distanciaNum <= 5).length;
    this.shoppings = postosProcessados.filter((p: any) => p.tag === 'Shopping').length;
    this.redeRapidaDC = postosProcessados.filter((p: any) => p.tag === 'Carga Rápida').length;

    this.todosOsPostos = postosProcessados.sort((a: any, b: any) => a.distanciaNum - b.distanciaNum);
    
    this.atualizarListaExibida();
  }

  alternarVerTodos(event: Event) {
    event.preventDefault();
    this.mostrarTodos = !this.mostrarTodos;
    this.atualizarListaExibida();
  }

  atualizarListaExibida() {
    if (this.mostrarTodos) {
      this.postosExibidos = this.todosOsPostos;
    } else {
      this.postosExibidos = this.todosOsPostos.slice(0, 3);
    }
  }

  private calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
  }

  abrirMapa() {
    this.router.navigate(['/mapa']);
  }
  sair() {
    if (confirm('Tem certeza que deseja sair do Íon?')) {
      sessionStorage.clear();
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}