import { Component, OnInit, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';
import { EstacaoService } from '../../core/services/estacao';
import { AuthService } from '../../core/services/auth.service';
import { EstacaoProcessada, RouteResponse } from '../../core/models/estacao.model';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.css']
})
export class Mapa implements OnInit, AfterViewInit, OnDestroy {
  
  // Injeções Modernas do Angular
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private estacaoService = inject(EstacaoService);
  private authService = inject(AuthService);

  // Dados Globais
  usuario = this.authService.getUserInfo();
  totalEstacoes: number = 0;

  // Estado do Mapa e Componente
  private map!: L.Map;
  private markers: L.Marker[] = [];
  private markerUsuario!: L.Marker;
  private querySub!: Subscription;
  private rotaAtual: L.Polyline | null = null;
  
  // Variáveis de Controle de Tela
  mostrarLista: boolean = false;
  termoBusca: string = '';
  tempoRota: string | null = null;
  
  // Dados de Estações
  postosOrdenados: EstacaoProcessada[] = [];
  postosFiltrados: EstacaoProcessada[] = [];
  postoSelecionado: EstacaoProcessada | null = null;
  postoPendenteParaAbrir: EstacaoProcessada | null = null;

  // Localização Padrão (Salvador)
  private latUsuario: number = -12.9714;
  private lonUsuario: number = -38.5104;

  // Carrossel
  imagensCarrossel: string[] = ['/imagem.jpg', '/images.jpg', '/imagen.jpg'];
  imagemAtualIndex: number = 0;
  private carrosselInterval: any;

  ngOnInit(): void {
    this.processarEstacoes();
    this.buscarLocalizacaoReal();

    this.querySub = this.route.queryParams.subscribe(params => {
      if (params['loc']) {
        const nomePosto = params['loc'];
        const posto = this.postosOrdenados.find(p => p.nome === nomePosto);
        if (posto) {
          this.postoPendenteParaAbrir = posto;
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.iniciarMapa();
  }

  ngOnDestroy(): void {
    this.pararCarrossel();
    if (this.querySub) this.querySub.unsubscribe();
    if (this.map) {
      this.map.off();
      this.map.remove();
    }
  }

    private iniciarMapa(): void {
    this.map = L.map('map', { zoomControl: false }).setView([this.latUsuario, this.lonUsuario], 13);
    
    // CORREÇÃO: Usando o OpenStreetMap padrão (cores normais)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);
    
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);
    this.atualizarMarcadorUsuario();
    this.adicionarMarcadoresPostos();

    if (this.postoPendenteParaAbrir) {
      setTimeout(() => this.abrirDetalhes(this.postoPendenteParaAbrir!), 500);
      this.postoPendenteParaAbrir = null;
    }
  }

  private buscarLocalizacaoReal(): void {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.latUsuario = pos.coords.latitude;
        this.lonUsuario = pos.coords.longitude;
        this.processarEstacoes();
        if (this.map) {
          this.map.setView([this.latUsuario, this.lonUsuario], 14);
          this.atualizarMarcadorUsuario();
          this.adicionarMarcadoresPostos();
        }
      },
      () => console.warn('GPS bloqueado.')
    );
  }

  private atualizarMarcadorUsuario(): void {
    if (!this.map) return;
    if (this.markerUsuario) this.map.removeLayer(this.markerUsuario);
    
    const iconHtml = `<div class="position-relative d-flex align-items-center justify-content-center" style="width: 24px; height: 24px;">
                        <div class="position-absolute bg-primary rounded-circle" style="width: 100%; height: 100%; opacity: 0.4; animation: pulse-gps 2s infinite;"></div>
                        <div class="bg-primary rounded-circle border border-2 border-white shadow" style="width: 14px; height: 14px; z-index: 2;"></div>
                      </div>`;
    
    const customIcon = L.divIcon({ html: iconHtml, className: 'custom-marker-container', iconSize: [24, 24], iconAnchor: [12, 12] });
    this.markerUsuario = L.marker([this.latUsuario, this.lonUsuario], { icon: customIcon, zIndexOffset: 1000 }).addTo(this.map);
  }

  private processarEstacoes(): void {
    const brutos = this.estacaoService.getEstacoes();
    this.totalEstacoes = brutos.length;

    this.postosOrdenados = brutos.map(posto => {
      const dist = this.estacaoService.calcularDistancia(this.latUsuario, this.lonUsuario, posto.lat, posto.lon);
      let tag = 'Público';
      let tagColor = 'text-neon';
      if (posto.isShopping) { tag = 'Shopping'; tagColor = 'text-purple'; }
      else if (posto.isFast) { tag = 'Carga Rápida'; tagColor = 'text-blue'; }

      return {
        ...posto,
        distanciaNum: dist,
        distancia: dist.toFixed(1),
        tag, tagColor
      };
    }).sort((a, b) => a.distanciaNum - b.distanciaNum);

    this.postosFiltrados = [...this.postosOrdenados];
  }

  private adicionarMarcadoresPostos(): void {
    if (!this.map) return;
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];

    this.postosOrdenados.forEach(posto => {
      let extraClass = '';
      if (posto.isShopping) extraClass = 'shopping';
      else if (posto.isFast) extraClass = 'fast';
      
      if (posto.alertaAtual) extraClass += ' alerta-ativo';

      const iconHtml = `<div class="neon-marker ${extraClass}"><i class="bi bi-lightning-charge-fill"></i></div>`;
      const customIcon = L.divIcon({ html: iconHtml, className: 'custom-marker-container', iconSize: [48, 48], iconAnchor: [24, 24] });

      const marker = L.marker([posto.lat, posto.lon], { icon: customIcon }).addTo(this.map);
      marker.on('click', () => {
        this.abrirDetalhes(posto);
        this.map.setView([posto.lat, posto.lon], 16, { animate: true, duration: 0.5 });
      });
      this.markers.push(marker);
    });
  }

  filtrarPostos(): void {
    if (!this.termoBusca) {
      this.postosFiltrados = [...this.postosOrdenados];
      return;
    }
    const termo = this.termoBusca.toLowerCase();
    this.postosFiltrados = this.postosOrdenados.filter(p => 
      p.nome.toLowerCase().includes(termo) || p.endereco.toLowerCase().includes(termo)
    );
  }

  toggleLista(): void { this.mostrarLista = !this.mostrarLista; }
  
  abrirDetalhes(posto: EstacaoProcessada): void {
    this.postoSelecionado = posto;
    this.iniciarCarrossel();
    if (window.innerWidth <= 768 && this.mostrarLista) {
      this.mostrarLista = false;
    }
  }

  fecharDetalhes(): void {
    this.postoSelecionado = null;
    this.encerrarRota();
    this.pararCarrossel();
  }

  async tracarRota(): Promise<void> {
    if (!this.postoSelecionado || !this.map) return;
    this.encerrarRota();

    const start = `${this.lonUsuario},${this.latUsuario}`;
    const end = `${this.postoSelecionado.lon},${this.postoSelecionado.lat}`;
    const url = `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`;

    try {
      const response = await fetch(url);
      const data: RouteResponse = await response.json(); // Usando a Tipagem correta!
      
      if (!this.map || !data.routes || data.routes.length === 0) return;

      const routeCoordinates = data.routes[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
      const minutos = Math.round(data.routes[0].duration / 60);

      this.tempoRota = minutos < 1 ? '< 1 min' : minutos >= 60 ? `${Math.floor(minutos / 60)}h ${minutos % 60}min` : `${minutos} min`;
      
      this.rotaAtual = L.polyline(routeCoordinates as L.LatLngExpression[], {
        color: '#00E59B', weight: 6, opacity: 0.9, lineCap: 'round', lineJoin: 'round', dashArray: '10, 15'
      }).addTo(this.map);
      
      this.map.fitBounds(this.rotaAtual.getBounds(), { padding: [50, 50] });
    } catch (error) {
      console.error(error);
      alert("Não foi possível traçar a rota online.");
    }
  }

  encerrarRota(): void {
    if (this.rotaAtual && this.map) {
      this.map.removeLayer(this.rotaAtual);
      this.rotaAtual = null;
    }
    this.tempoRota = null;
  }

    reportarProblema(tipo: string): void {
    if (!this.postoSelecionado) return;

    if (tipo === 'Posto Livre') {
      
      this.postoSelecionado.alertaAtual = undefined;
    } else {
      // Cria um alerta normal para outras situações (Fila, Avariado, etc.)
      this.postoSelecionado.alertaAtual = {
        tipo: tipo,
        tempo: 'Agora mesmo'
      };
    }

    // Atualiza a lista principal para refletir a mudança no mapa
    const index = this.postosOrdenados.findIndex(p => p.nome === this.postoSelecionado!.nome);
    if (index !== -1) {
      this.postosOrdenados[index].alertaAtual = this.postoSelecionado.alertaAtual;
      
      // Isso força o mapa a atualizar o marcador (se ele estava vermelho/piscando, ele volta ao normal)
      this.adicionarMarcadoresPostos();
    }
  }

  iniciarCarrossel() {
    this.pararCarrossel();
    this.carrosselInterval = setInterval(() => this.nextImage(), 3000);
  }

  pararCarrossel() {
    if (this.carrosselInterval) {
      clearInterval(this.carrosselInterval);
      this.carrosselInterval = null;
    }
  }

  nextImage() { this.imagemAtualIndex = (this.imagemAtualIndex + 1) % this.imagensCarrossel.length; }
  prevImage() { this.imagemAtualIndex = (this.imagemAtualIndex - 1 + this.imagensCarrossel.length) % this.imagensCarrossel.length; }
}