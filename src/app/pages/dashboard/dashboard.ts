import { Component, OnInit } from '@angular/core';
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
    marca: 'BYD',
    modelo: 'Dolphin',
    conectores: ['Tipo 2', 'CCS2']
  };

  private latSalvador = -12.9714;
  private lonSalvador = -38.5114;

  // BANCO DE DADOS LOCAL EMBUTIDO (Garante 100% de funcionamento sem falhas de API)
  private postosSalvador = [
    { lat: -12.9786, lon: -38.4544, nome: 'Eletroposto Salvador Shopping', endereco: 'Av. Tancredo Neves, 3133', isShopping: true, isFast: false },
    { lat: -12.9801, lon: -38.4554, nome: 'Recarga Shopping da Bahia', endereco: 'Av. Tancredo Neves, 148', isShopping: true, isFast: true },
    { lat: -13.0069, lon: -38.5229, nome: 'Tupinambá Shopping Barra', endereco: 'Av. Centenário, 2992', isShopping: true, isFast: false },
    { lat: -12.9288, lon: -38.3965, nome: 'Eletroposto Shopping Paralela', endereco: 'Av. Luís Viana Filho, 8544', isShopping: true, isFast: false },
    { lat: -12.8841, lon: -38.3072, nome: 'EZVolt Parque Shopping Bahia', endereco: 'R. Maria Tavares de Resende, 82', isShopping: true, isFast: true },
    { lat: -12.9133, lon: -38.3311, nome: 'Neoenergia Aeroporto', endereco: 'Praça Gago Coutinho, s/n', isShopping: false, isFast: true },
    { lat: -12.9701, lon: -38.4589, nome: 'Concessionária BYD Eurovia', endereco: 'Av. Antônio Carlos Magalhães, 3213', isShopping: false, isFast: true },
    { lat: -12.9650, lon: -38.4600, nome: 'GWM Morena Veículos', endereco: 'Av. Barros Reis, 1876', isShopping: false, isFast: true },
    { lat: -13.0031, lon: -38.4900, nome: 'Hospital Mater Dei', endereco: 'Av. Vasco da Gama, 5929', isShopping: false, isFast: false },
    { lat: -12.9740, lon: -38.5120, nome: 'Fera Palace Hotel', endereco: 'R. Chile, 20', isShopping: false, isFast: false },
    { lat: -12.9926, lon: -38.4641, nome: 'Pão de Açúcar Costa Azul', endereco: 'R. Arthur de Azevêdo Machado, 1475', isShopping: false, isFast: false },
    { lat: -12.9351, lon: -38.3496, nome: 'Senai Cimatec', endereco: 'Av. Orlando Gomes, 1845', isShopping: false, isFast: true },
    { lat: -12.8315, lon: -38.2581, nome: 'Outlet Premium Salvador', endereco: 'Estrada do Coco, km 12.5', isShopping: true, isFast: true },
    { lat: -12.9863, lon: -38.4411, nome: 'Assaí Atacadista Rótula', endereco: 'Rótula do Abacaxi', isShopping: false, isFast: false }
  ];

  // Repare que removemos a injeção do 'EstacaoService' daqui
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  private carregarDados(): void {
    this.totalEstacoes = this.postosSalvador.length;

    // Processa os dados locais na hora (sem atrasos de rede)
    const postosProcessados = this.postosSalvador.map((posto: any) => {
      const distanciaKm = this.calcularDistancia(this.latSalvador, this.lonSalvador, posto.lat, posto.lon);
      
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
    alert('Navegar para o Mapa de Eletropostos!');
  }

  sair() {
    if (confirm('Tem certeza que deseja sair do Íon?')) {
      sessionStorage.clear();
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}