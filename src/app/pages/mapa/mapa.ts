import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.css']
})
export class Mapa implements OnInit, AfterViewInit {
  private map: any;
  private marcadoresMapa: L.Marker[] = [];

  totalEstacoes: number = 0;
  postosOrdenados: any[] = [];
  mostrarLista: boolean = false;
  
  // Controle do novo Painel de Detalhes e Rotas
  postoSelecionado: any = null;
  rotaAtual: L.Polyline | null = null;

  private latUsuario = -12.93815293615882; 
  private lonUsuario = -38.387176444288;

  private postosSalvador = [
    { lat: -12.977049863575994, lon: -38.45523139478341, nome: 'Eletroposto Salvador Shopping', endereco: 'Av. Tancredo Neves, 3133', isShopping: true, isFast: false },
    { lat: -12.981060367578994, lon: -38.464886730568125, nome: 'Recarga Shopping da Bahia', endereco: 'Av. Tancredo Neves, 148', isShopping: true, isFast: true },
    { lat: -13.006866204557813, lon: -38.52539175294331, nome: 'Tupinambá Shopping Barra', endereco: 'Av. Centenário, 2992', isShopping: true, isFast: false },
    { lat: -12.935662659926377, lon: -38.39478408824208, nome: 'Eletroposto Shopping Paralela', endereco: 'Av. Luís Viana Filho, 8544', isShopping: true, isFast: false },
    { lat: -12.887350713571314, lon: -38.31854761004745, nome: 'EZVolt Parque Shopping Bahia', endereco: 'R. Maria Tavares de Resende, 82', isShopping: true, isFast: true },
    { lat: -12.91547265239023, lon: -38.33508930543007, nome: 'Neoenergia Aeroporto', endereco: 'Praça Gago Coutinho, s/n', isShopping: false, isFast: true },
    { lat: -12.976565596401521, lon: -38.470048690383194, nome: 'Concessionária BYD Eurovia', endereco: 'Av. Antônio Carlos Magalhães, 3213', isShopping: false, isFast: true },
    { lat: -12.964267, lon: -38.472772, nome: 'GWM Morena Veículos', endereco: 'Av. Barros Reis, 1876', isShopping: false, isFast: true },
    { lat: -13.006795748195456, lon: -38.49289286125157, nome: 'Hospital Mater Dei', endereco: 'Rio Vermelho', isShopping: false, isFast: false },
    { lat: -12.97598727410513, lon: -38.51365722077102, nome: 'Fera Palace Hotel', endereco: 'R. Chile, 20', isShopping: false, isFast: false },
    { lat: -12.988091802574289, lon: -38.44843652743008, nome: 'Pão de Açúcar Costa Azul', endereco: 'R. Arthur Machado, 1475', isShopping: false, isFast: false },
    { lat: -12.93815293615882, lon: -38.387176444288, nome: 'Senai Cimatec', endereco: 'Av. Orlando Gomes, 1845', isShopping: false, isFast: true },
    { lat: -12.824732790786019, lon: -38.26757339008946, nome: 'Outlet Premium Salvador', endereco: 'Estrada do Coco', isShopping: true, isFast: true },
    { lat: -12.970573485539708, lon: -38.48104656125183, nome: 'Assaí Atacadista Rótula', endereco: 'Rótula do Abacaxi', isShopping: false, isFast: false }
  ];

  constructor(private router: Router, private zone: NgZone) {}

  ngOnInit() {
    this.processarEstacoes();
    this.buscarLocalizacaoReal();
  }

  ngAfterViewInit() {
    this.iniciarMapa();
  }

  toggleLista() {
    this.mostrarLista = !this.mostrarLista;
  }

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
        (error) => console.warn('GPS bloqueado. Usando Cimatec.'),
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 }
      );
    }
  }

  private processarEstacoes(): void {
    this.totalEstacoes = this.postosSalvador.length;
    const postos = this.postosSalvador.map(posto => {
      const distanciaKm = this.calcularDistancia(this.latUsuario, this.lonUsuario, posto.lat, posto.lon);
      let tag = 'Público';
      let tagColor = 'text-neon';
      if (posto.isShopping) { tag = 'Shopping'; tagColor = 'text-purple'; }
      else if (posto.isFast) { tag = 'Carga Rápida'; tagColor = 'text-blue'; }
      return { ...posto, distanciaNum: distanciaKm, distancia: distanciaKm.toFixed(1), tag: tag, tagColor: tagColor };
    });
    this.postosOrdenados = postos.sort((a, b) => a.distanciaNum - b.distanciaNum);
  }

  private iniciarMapa(): void {
    this.map = L.map('map', { zoomControl: false }).setView([-12.9714, -38.5114], 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // Adicionar Marcador do Usuário
    const userIcon = L.divIcon({
      className: 'custom-marker-container',
      html: `<div class="user-marker"><i class="bi bi-person-fill"></i></div>`,
      iconSize: [38, 38], iconAnchor: [19, 19]
    });
    L.marker([this.latUsuario, this.lonUsuario], { icon: userIcon }).addTo(this.map);

    // Adicionar Postos
    this.postosOrdenados.forEach((posto) => {
      let cssClass = 'neon-marker';
      if (posto.isShopping) cssClass += ' shopping';
      else if (posto.isFast) cssClass += ' fast';

      const iconeCustomizado = L.divIcon({
        className: 'custom-marker-container',
        html: `<div class="${cssClass}"><i class="bi bi-lightning-charge-fill text-white"></i></div>`,
        iconSize: [48, 48], iconAnchor: [24, 24]
      });

      const marker = L.marker([posto.lat, posto.lon], { icon: iconeCustomizado }).addTo(this.map);
      
      // Quando clicar no pino, abre o Novo Painel!
      marker.on('click', () => {
        this.zone.run(() => { this.abrirDetalhes(posto); });
      });
      
      this.marcadoresMapa.push(marker);
    });

    setTimeout(() => { this.map.invalidateSize(); }, 500);
  }

  focarNoPosto(lat: number, lon: number, index: number) {
    this.abrirDetalhes(this.postosOrdenados[index]);
  }

  // ========================================================
  // LÓGICA DO NOVO PAINEL DE DETALHES E ROTA
  // ========================================================
  abrirDetalhes(posto: any) {
    this.postoSelecionado = posto;
    this.mostrarLista = false; // Fecha a gaveta da esquerda se estiver aberta
    this.map.flyTo([posto.lat, posto.lon], 16, { animate: true, duration: 1.5 });
  }

  fecharDetalhes() {
    this.postoSelecionado = null;
    if (this.rotaAtual) {
      this.map.removeLayer(this.rotaAtual);
      this.rotaAtual = null;
    }
  }

  async tracarRota() {
    if (!this.postoSelecionado) return;

    // Limpa a rota antiga se o usuário já tiver gerado uma
    if (this.rotaAtual) {
      this.map.removeLayer(this.rotaAtual);
    }

    // Coordenadas: OSRM usa formato [Longitude, Latitude] na URL
    const start = `${this.lonUsuario},${this.latUsuario}`;
    const end = `${this.postoSelecionado.lon},${this.postoSelecionado.lat}`;
    const url = `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      // O GeoJSON inverte para [Lon, Lat], o Leaflet precisa de [Lat, Lon]
      const routeCoordinates = data.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]);

      // Desenha a linha da rota no mapa
      this.rotaAtual = L.polyline(routeCoordinates, {
        color: '#00E59B', // Verde Neon do sistema
        weight: 6,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: '10, 15' // Efeito tracejado animado
      }).addTo(this.map);

      // Ajusta o zoom do mapa para mostrar toda a rota do carro até o posto
      this.map.fitBounds(this.rotaAtual.getBounds(), { padding: [50, 50] });

    } catch (error) {
      alert("Erro ao buscar a rota. Verifique sua conexão com a internet.");
    }
  }

  private calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
  }

  voltar() { this.router.navigate(['/dashboard']); }
  
  sair() {
    if (confirm('Sair do Íon?')) {
      sessionStorage.clear();
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}