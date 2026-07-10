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

  // Localização do Campus do SENAI Cimatec (Fallback)
  private latUsuario = -12.93815293615882; 
  private lonUsuario = -38.387176444288;

  // Banco de Dados com GPS de alta precisão (Atualizado com seus dados)
  private postosSalvador = [
    { lat: -12.977049863575994, lon: -38.45523139478341, nome: 'Eletroposto Salvador Shopping', endereco: 'Av. Tancredo Neves, 3133', isShopping: true, isFast: false },
    { lat: -12.981060367578994, lon: -38.464886730568125, nome: 'Recarga Shopping da Bahia', endereco: 'Av. Tancredo Neves, 148', isShopping: true, isFast: true },
    { lat: -13.006866204557813, lon: -38.52539175294331, nome: 'Tupinambá Shopping Barra', endereco: 'Av. Centenário, 2992', isShopping: true, isFast: false },
    { lat: -12.935662659926377, lon: -38.39478408824208, nome: 'Eletroposto Shopping Paralela', endereco: 'Av. Luís Viana Filho, 8544', isShopping: true, isFast: false },
    { lat: -12.887350713571314, lon: -38.31854761004745, nome: 'EZVolt Parque Shopping Bahia', endereco: 'R. Maria Tavares de Resende, 82', isShopping: true, isFast: true },
    { lat: -12.91547265239023, lon: -38.33508930543007, nome: 'Neoenergia Aeroporto', endereco: 'Praça Gago Coutinho, s/n', isShopping: false, isFast: true },
    { lat: -12.976565596401521, lon: -38.470048690383194, nome: 'Concessionária BYD Eurovia', endereco: 'Av. Antônio Carlos Magalhães, 3213', isShopping: false, isFast: true },
    { lat: -12.964267, lon: -38.472772, nome: 'GWM Morena Veículos', endereco: 'Av. Barros Reis, 1876', isShopping: false, isFast: true },
    { lat: -13.006795748195456, lon: -38.49289286125157, nome: 'Hospital Mater Dei', endereco: 'Rio Vermelho / Vasco da Gama', isShopping: false, isFast: false },
    { lat: -12.97598727410513, lon: -38.51365722077102, nome: 'Fera Palace Hotel', endereco: 'R. Chile, 20', isShopping: false, isFast: false },
    { lat: -12.988091802574289, lon: -38.44843652743008, nome: 'Pão de Açúcar Costa Azul', endereco: 'R. Arthur de Azevêdo Machado, 1475', isShopping: false, isFast: false },
    { lat: -12.93815293615882, lon: -38.387176444288, nome: 'Senai Cimatec', endereco: 'Av. Orlando Gomes, 1845', isShopping: false, isFast: true },
    { lat: -12.824732790786019, lon: -38.26757339008946, nome: 'Outlet Premium Salvador', endereco: 'Estrada do Coco, Camaçari', isShopping: true, isFast: true },
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
    // 1. Inicializa o mapa
    this.map = L.map('map', { zoomControl: false }).setView([-12.9714, -38.5114], 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // 2. Aguarda um curto intervalo para garantir que o contêiner do mapa está pronto
    setTimeout(() => {
        this.map.invalidateSize();
        
        // 3. Desenha os marcadores
        this.postosOrdenados.forEach((posto) => {
            let cssClass = 'neon-marker';
            if (posto.isShopping) cssClass += ' shopping';
            else if (posto.isFast) cssClass += ' fast';

            const iconeCustomizado = L.divIcon({
                className: 'custom-icon',
                html: `<div class="${cssClass}"><i class="bi bi-lightning-charge-fill text-white"></i></div>`,
                iconSize: [48, 48],
                iconAnchor: [24, 24],
                popupAnchor: [0, -24]
            });

            const marker = L.marker([posto.lat, posto.lon], { icon: iconeCustomizado })
                .addTo(this.map)
                .bindPopup(`<b style="color: black;">${posto.nome}</b><br><span style="color: #6e7681; font-size: 13px;">${posto.endereco}</span>`);
            
            this.marcadoresMapa.push(marker);
        });
    }, 300);
  }

  focarNoPosto(lat: number, lon: number, index: number) {
    this.map.flyTo([lat, lon], 16, { animate: true, duration: 1.5 });
    setTimeout(() => {
      this.marcadoresMapa[index].openPopup();
      if (window.innerWidth <= 768) {
        this.mostrarLista = false;
      }
    }, 1500);
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

  voltar() {
    this.router.navigate(['/dashboard']);
  }

  sair() {
    if (confirm('Tem certeza que deseja sair do Íon?')) {
      sessionStorage.clear();
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}