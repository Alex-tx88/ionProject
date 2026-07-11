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
  private userMarker: any = null;

  totalEstacoes: number = 0;
  postosOrdenados: any[] = [];
  mostrarLista: boolean = false;
  
  postoSelecionado: any = null;
  rotaAtual: any = null; 
  tempoRota: string | null = null; // Variável nova para guardar o tempo estimado

  private latUsuario = -12.938152; 
  private lonUsuario = -38.387176;

  imagemAtualIndex: number = 0;
  carrosselInterval: any;
  imagensCarrossel: string[] = [
    'images.jpg',
    'imagem.jpg',
    'imagen.jpg'
  ];

  private postosSalvador = [
    { lat: -12.9770498, lon: -38.4552313, nome: 'Eletroposto Salvador Shopping', endereco: 'Av. Tancredo Neves, 3133', isShopping: true, isFast: false, potencia: '22 kW', conector: 'Tipo 2' },
    { lat: -12.9810603, lon: -38.4648867, nome: 'Recarga Shopping da Bahia', endereco: 'Av. Tancredo Neves, 148', isShopping: true, isFast: true, potencia: '150 kW', conector: 'CCS2' },
    { lat: -13.0068662, lon: -38.5253917, nome: 'Tupinambá Shopping Barra', endereco: 'Av. Centenário, 2992', isShopping: true, isFast: false, potencia: '22 kW', conector: 'Tipo 2' },
    { lat: -12.9356626, lon: -38.3947840, nome: 'Eletroposto Shopping Paralela', endereco: 'Av. Luís Viana Filho, 8544', isShopping: true, isFast: false, potencia: '22 kW', conector: 'Tipo 2' },
    { lat: -12.8873507, lon: -38.3185476, nome: 'EZVolt Parque Shopping Bahia', endereco: 'R. Maria Tavares de Resende, 82', isShopping: true, isFast: true, potencia: '50 kW', conector: 'CCS2' },
    { lat: -12.9154726, lon: -38.3350893, nome: 'Neoenergia Aeroporto', endereco: 'Praça Gago Coutinho, s/n', isShopping: false, isFast: true, potencia: '50 kW', conector: 'CCS2' },
    { lat: -12.9765655, lon: -38.4700486, nome: 'Concessionária BYD Eurovia', endereco: 'Av. Antônio Carlos Magalhães, 3213', isShopping: false, isFast: true, potencia: '120 kW', conector: 'CCS2' },
    { lat: -12.964267, lon: -38.472772, nome: 'GWM Morena Veículos', endereco: 'Av. Barros Reis, 1876', isShopping: false, isFast: true, potencia: '100 kW', conector: 'CCS2' },
    { lat: -13.0067957, lon: -38.4928928, nome: 'Hospital Mater Dei', endereco: 'Rio Vermelho', isShopping: false, isFast: false, potencia: '22 kW', conector: 'Tipo 2' },
    { lat: -12.9759872, lon: -38.5136572, nome: 'Fera Palace Hotel', endereco: 'R. Chile, 20', isShopping: false, isFast: false, potencia: '7 kW', conector: 'Tipo 2' },
    { lat: -12.9880918, lon: -38.4484365, nome: 'Pão de Açúcar Costa Azul', endereco: 'R. Arthur Machado, 1475', isShopping: false, isFast: false, potencia: '22 kW', conector: 'Tipo 2' },
    { lat: -12.9381529, lon: -38.3871764, nome: 'Senai Cimatec', endereco: 'Av. Orlando Gomes, 1845', isShopping: false, isFast: true, potencia: '150 kW', conector: 'CCS2' },
    { lat: -12.8247327, lon: -38.2675733, nome: 'Outlet Premium Salvador', endereco: 'Estrada do Coco', isShopping: true, isFast: true, potencia: '50 kW', conector: 'CCS2' },
    { lat: -12.9705734, lon: -38.4810465, nome: 'Assaí Atacadista Rótula', endereco: 'Rótula do Abacaxi', isShopping: false, isFast: false, potencia: '22 kW', conector: 'Tipo 2' }
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
    if (this.mostrarLista) this.fecharDetalhes();
  }

  private buscarLocalizacaoReal(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.zone.run(() => {
            this.latUsuario = position.coords.latitude;
            this.lonUsuario = position.coords.longitude;
            
            if (this.userMarker) {
              this.userMarker.setLatLng([this.latUsuario, this.lonUsuario]);
            }
            this.processarEstacoes(); 
          });
        },
        (error) => console.warn('GPS bloqueado.'),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
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
    this.map = L.map('map', { zoomControl: false }).setView([this.latUsuario, this.lonUsuario], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    const userIcon = L.divIcon({
      className: '', 
      html: `
        <div style="position: relative; width: 20px; height: 20px; background-color: #4285F4; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(66, 133, 244, 0.8);">
          <div style="position: absolute; top: -15px; left: -15px; width: 44px; height: 44px; background-color: rgba(66, 133, 244, 0.3); border-radius: 50%; animation: pulse-gps 2s infinite;"></div>
        </div>
      `,
      iconSize: [20, 20], 
      iconAnchor: [10, 10]
    });
    this.userMarker = L.marker([this.latUsuario, this.lonUsuario], { icon: userIcon, zIndexOffset: 9999 }).addTo(this.map);

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

  abrirDetalhes(posto: any) {
    this.postoSelecionado = posto;
    this.mostrarLista = false;
    this.imagemAtualIndex = 0; 
    this.tempoRota = null; // Reseta o tempo quando abrir um posto novo
    this.iniciarCarrossel();   
    this.map.flyTo([posto.lat, posto.lon + 0.015], 14, { animate: true, duration: 1.5 });
  }

  fecharDetalhes() {
    this.postoSelecionado = null;
    this.tempoRota = null; // Zera a estimativa de tempo
    this.pararCarrossel();
    if (this.rotaAtual) {
      this.map.removeLayer(this.rotaAtual);
      this.rotaAtual = null;
    }
  }

  iniciarCarrossel() {
    this.pararCarrossel(); 
    this.carrosselInterval = setInterval(() => {
      this.nextImage();
    }, 3000); 
  }

  pararCarrossel() {
    if (this.carrosselInterval) {
      clearInterval(this.carrosselInterval);
    }
  }

  nextImage() {
    this.imagemAtualIndex = (this.imagemAtualIndex + 1) % this.imagensCarrossel.length;
  }

  prevImage() {
    this.imagemAtualIndex = (this.imagemAtualIndex - 1 + this.imagensCarrossel.length) % this.imagensCarrossel.length;
  }

  setImagem(index: number) {
    this.imagemAtualIndex = index;
    this.iniciarCarrossel(); 
  }

  async tracarRota() {
    if (!this.postoSelecionado) return;
    if (this.rotaAtual) { this.map.removeLayer(this.rotaAtual); }

    const start = `${this.lonUsuario},${this.latUsuario}`;
    const end = `${this.postoSelecionado.lon},${this.postoSelecionado.lat}`;
    const url = `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const routeCoordinates = data.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]);

      // =====================================
      // CÁLCULO DE TEMPO ESTIMADO (ETA)
      // =====================================
      const duracaoSegundos = data.routes[0].duration;
      const minutos = Math.round(duracaoSegundos / 60);

      if (minutos < 1) {
        this.tempoRota = '< 1 min';
      } else if (minutos >= 60) {
        const horas = Math.floor(minutos / 60);
        const minsRestantes = minutos % 60;
        this.tempoRota = `${horas}h ${minsRestantes}min`;
      } else {
        this.tempoRota = `${minutos} min`;
      }

      this.rotaAtual = L.polyline(routeCoordinates, {
        color: '#00E59B', weight: 6, opacity: 0.9, lineCap: 'round', lineJoin: 'round', dashArray: '10, 15'
      }).addTo(this.map);

      this.map.fitBounds(this.rotaAtual.getBounds(), { padding: [50, 50] });
    } catch (error) {
      alert("Não foi possível traçar a rota online.");
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