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
  // SISTEMA DE NOTIFICAÇÕES (Focado na Ford)
  // ==========================================
  mostrarNotificacoes: boolean = false;
  notificacoes = [
    { titulo: 'Novo posto adicionado', mensagem: 'O Íon mapeou uma nova estação perto do Salvador Shopping.', tempo: 'Há 10 min', lida: false },
    { titulo: 'Bateria ideal', mensagem: 'Agende a revisão programada do seu veículo na concessionária Ford.' , tempo: 'Há 2h', lida: false },
    { titulo: 'Bem-vindo ao Íon', mensagem: 'Seu perfil foi configurado com sucesso.', tempo: 'Ontem', lida: true }
  ];

  // ==========================================
  // FIX: COORDENADAS PADRÃO (CENTRO DE SALVADOR)
  // ==========================================
  private latUsuario = -12.9714; 
  private lonUsuario = -38.5104;

  // Banco de Dados com Concessionárias Ford
  private postosSalvador = [
    { lat: -12.9770498, lon: -38.4552313, nome: 'Eletroposto Salvador Shopping', endereco: 'Av. Tancredo Neves, 3133', isShopping: true, isFast: false },
    { lat: -12.9810603, lon: -38.4648867, nome: 'Recarga Shopping da Bahia', endereco: 'Av. Tancredo Neves, 148', isShopping: true, isFast: true },
    { lat: -13.0068662, lon: -38.5253917, nome: 'Tupinambá Shopping Barra', endereco: 'Av. Centenário, 2992', isShopping: true, isFast: false },
    { lat: -12.9356626, lon: -38.3947840, nome: 'Eletroposto Shopping Paralela', endereco: 'Av. Luís Viana Filho, 8544', isShopping: true, isFast: false },
    { lat: -12.8873507, lon: -38.3185476, nome: 'EZVolt Parque Shopping Bahia', endereco: 'R. Maria Tavares de Resende, 82', isShopping: true, isFast: true },
    { lat: -12.9154726, lon: -38.3350893, nome: 'Neoenergia Aeroporto', endereco: 'Praça Gago Coutinho, s/n', isShopping: false, isFast: true },
    { lat: -12.9765655, lon: -38.4700486, nome: 'Concessionária Ford Indiana', endereco: 'Av. Antônio Carlos Magalhães, 3213', isShopping: false, isFast: true },
    { lat: -12.964267, lon: -38.472772, nome: 'Concessionária Ford Slaviero', endereco: 'Av. Barros Reis, 1876', isShopping: false, isFast: true },
    { lat: -13.0067957, lon: -38.4928928, nome: 'Hospital Mater Dei', endereco: 'Rio Vermelho', isShopping: false, isFast: false },
    { lat: -12.9759872, lon: -38.5136572, nome: 'Fera Palace Hotel', endereco: 'R. Chile, 20', isShopping: false, isFast: false },
    { lat: -12.9880918, lon: -38.4484365, nome: 'Pão de Açúcar Costa Azul', endereco: 'R. Arthur Machado, 1475', isShopping: false, isFast: false },
    { lat: -12.9381529, lon: -38.3871764, nome: 'Senai Cimatec', endereco: 'Av. Orlando Gomes, 1845', isShopping: false, isFast: true },
    { lat: -12.8247327, lon: -38.2675733, nome: 'Outlet Premium Salvador', endereco: 'Estrada do Coco', isShopping: true, isFast: true },
    { lat: -12.9705734, lon: -38.4810465, nome: 'Assaí Atacadista Rótula', endereco: 'Rótula do Abacaxi', isShopping: false, isFast: false }
  ];

  constructor(private router: Router, private zone: NgZone) {}

  ngOnInit(): void {
    this.processarEstacoes(); // Roda com o centro de Salvador primeiro
    this.buscarLocalizacaoReal(); // Tenta pegar a real
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
            this.processarEstacoes(); // Se o GPS for liberado, recalcula
          });
        },
        (error) => {
          this.zone.run(() => {
            console.warn('GPS bloqueado. Usando centro de Salvador como padrão.');
            this.latUsuario = -12.9714; 
            this.lonUsuario = -38.5104;
            this.processarEstacoes(); // Força o recálculo para garantir que os cards e a lista atualizem
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