import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router'; 
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { EstacaoService } from '../../core/services/estacao';
import { Estacao } from '../../core/models/estacao.model';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, FormsModule],
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.css']
})
export class Mapa implements OnInit, AfterViewInit {
  
  private map!: L.Map;
  private marcadoresMapa: L.Marker[] = [];
  private userMarker: L.Marker | null = null;
  private rotaAtual: L.Polyline | null = null; 

  totalEstacoes: number = 0;
  postosOrdenados: Estacao[] = [];
  postosFiltrados: Estacao[] = []; 
  termoBusca: string = '';

  mostrarLista: boolean = false;
  postoSelecionado: Estacao | null = null;
  tempoRota: string | null = null; 
  
  postoPendenteParaAbrir: Estacao | null = null; 

  imagemAtualIndex: number = 0;
  carrosselInterval: ReturnType<typeof setInterval> | null = null;
  imagensCarrossel: string[] = ['images.jpg', 'imagem.jpg', 'imagen.jpg'];

  private latUsuario: number = -12.9714; 
  private lonUsuario: number = -38.5104;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private zone: NgZone,
    private estacaoService: EstacaoService
  ) {}

  ngOnInit(): void {
    this.processarEstacoes();
    this.buscarLocalizacaoReal();

    this.route.queryParams.subscribe(params => {
      if (params['loc']) {
        const nomePosto = params['loc'];
        // Procura na nossa lista o posto com esse nome
        const posto = this.postosOrdenados.find(p => p.nome === nomePosto);
        if (posto) {
          // Guarda o posto para ser aberto assim que o mapa acabar de carregar
          this.postoPendenteParaAbrir = posto;
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.iniciarMapa();
  }

  toggleLista(): void {
    this.mostrarLista = !this.mostrarLista;
    if (this.mostrarLista) this.fecharDetalhes();
  }

  private buscarLocalizacaoReal(): void {
    if (!navigator.geolocation) return;

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
      () => console.warn('GPS bloqueado pelo usuário. Utilizando fallback.'),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }

  private processarEstacoes(): void {
    const postosBrutos = this.estacaoService.getEstacoes();
    this.totalEstacoes = postosBrutos.length;

    const postosProc = postosBrutos.map(posto => {
      const distanciaKm = this.estacaoService.calcularDistancia(this.latUsuario, this.lonUsuario, posto.lat, posto.lon);
      let tag = 'Público';
      let tagColor = 'text-neon';
      
      if (posto.isShopping) { tag = 'Shopping'; tagColor = 'text-purple'; }
      else if (posto.isFast) { tag = 'Carga Rápida'; tagColor = 'text-blue'; }

      return { 
        ...posto, distanciaNum: distanciaKm, distancia: distanciaKm.toFixed(1), tag, tagColor 
      };
    });

    this.postosOrdenados = postosProc.sort((a, b) => a.distanciaNum! - b.distanciaNum!);
    this.postosFiltrados = [...this.postosOrdenados];
  }

  filtrarPostos(): void {
    const termo = this.termoBusca.toLowerCase().trim();
    if (!termo) {
      this.postosFiltrados = [...this.postosOrdenados];
    } else {
      this.postosFiltrados = this.postosOrdenados.filter(posto => 
        posto.nome.toLowerCase().includes(termo) || 
        posto.endereco.toLowerCase().includes(termo)
      );
      this.mostrarLista = true; 
    }
    this.desenharMarcadores();
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
      iconSize: [20, 20], iconAnchor: [10, 10]
    });
    
    this.userMarker = L.marker([this.latUsuario, this.lonUsuario], { icon: userIcon, zIndexOffset: 9999 }).addTo(this.map);
    this.desenharMarcadores();
    
    setTimeout(() => { 
      this.map.invalidateSize(); 
      
      
      if (this.postoPendenteParaAbrir) {
        this.abrirDetalhes(this.postoPendenteParaAbrir);
        this.postoPendenteParaAbrir = null; // Limpa para não ficar em loop
      }
    }, 500);
  }

  private desenharMarcadores(): void {
    this.marcadoresMapa.forEach(marker => this.map.removeLayer(marker));
    this.marcadoresMapa = [];

    this.postosFiltrados.forEach((posto) => {
      let cssClass = 'neon-marker';
      if (posto.isShopping) cssClass += ' shopping';
      else if (posto.isFast) cssClass += ' fast';
      if (posto.alertaAtual) cssClass += ' alerta-ativo';

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
  }

  abrirDetalhes(posto: Estacao): void {
    this.postoSelecionado = posto;
    this.mostrarLista = false;
    this.imagemAtualIndex = 0; 
    this.tempoRota = null; 
    this.iniciarCarrossel();
    this.map.flyTo([posto.lat, posto.lon + 0.015], 14, { animate: true, duration: 1.5 });
  }

  fecharDetalhes(): void {
    this.postoSelecionado = null;
    this.tempoRota = null; 
    this.pararCarrossel();
    if (this.rotaAtual) {
      this.map.removeLayer(this.rotaAtual);
      this.rotaAtual = null;
    }
  }

  iniciarCarrossel(): void {
    this.pararCarrossel(); 
    this.carrosselInterval = setInterval(() => { this.nextImage(); }, 3000); 
  }

  pararCarrossel(): void {
    if (this.carrosselInterval) {
      clearInterval(this.carrosselInterval);
      this.carrosselInterval = null;
    }
  }

  nextImage(): void {
    this.imagemAtualIndex = (this.imagemAtualIndex + 1) % this.imagensCarrossel.length;
  }

  prevImage(): void {
    this.imagemAtualIndex = (this.imagemAtualIndex - 1 + this.imagensCarrossel.length) % this.imagensCarrossel.length;
  }

  setImagem(index: number): void {
    this.imagemAtualIndex = index;
    this.iniciarCarrossel(); 
  }

  async tracarRota(): Promise<void> {
    if (!this.postoSelecionado) return;
    if (this.rotaAtual) { this.map.removeLayer(this.rotaAtual); }

    const start = `${this.lonUsuario},${this.latUsuario}`;
    const end = `${this.postoSelecionado.lon},${this.postoSelecionado.lat}`;
    const url = `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const routeCoordinates = data.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]);
      const duracaoSegundos = data.routes[0].duration;
      const minutos = Math.round(duracaoSegundos / 60);

      this.tempoRota = minutos < 1 ? '< 1 min' : minutos >= 60 ? `${Math.floor(minutos / 60)}h ${minutos % 60}min` : `${minutos} min`;
      this.rotaAtual = L.polyline(routeCoordinates as L.LatLngExpression[], {
        color: '#00E59B', weight: 6, opacity: 0.9, lineCap: 'round', lineJoin: 'round', dashArray: '10, 15'
      }).addTo(this.map);
      this.map.fitBounds(this.rotaAtual.getBounds(), { padding: [50, 50] });
    } catch (error) {
      alert("Não foi possível traçar a rota online.");
      console.error(error);
    }
  }

  encerrarRota(): void {
    this.tempoRota = null;
    if (this.rotaAtual) {
      this.map.removeLayer(this.rotaAtual);
      this.rotaAtual = null;
    }
  }

  reportarProblema(tipo: string): void {
    if (!this.postoSelecionado) return;
    if (tipo === 'Posto Livre') {
      if (confirm(`Confirmar que este posto está livre e a funcionar?`)) {
        this.postoSelecionado.alertaAtual = undefined;
        alert('Obrigado! O posto está agora marcado como Livre para todos.');
        this.desenharMarcadores();
        this.fecharDetalhes();
      }
      return;
    }
    if (confirm(`Deseja reportar "${tipo}" neste posto para a comunidade Íon?`)) {
      this.postoSelecionado.alertaAtual = { tipo: tipo, tempo: 'Agora mesmo' };
      alert('Obrigado! A comunidade foi alertada em tempo real.');
      this.desenharMarcadores();
      this.fecharDetalhes();
    }
  }

  voltar(): void { this.router.navigate(['/dashboard']); }
  
  sair(): void {
    if (confirm('Sair do Íon?')) {
      sessionStorage.clear();
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}