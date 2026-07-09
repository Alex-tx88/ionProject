import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EstacaoService } from '../../core/services/estacao';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'] // Ou styleUrl, dependendo da versão
})
export class Dashboard implements OnInit {
  // Dados calculados a partir da API
  totalEstacoes: number = 0;
  estacoesRaio5km: number = 0;
  shoppings: number = 0;
  redeRapidaDC: number = 0;
  postosRecentes: any[] = [];

  // Dados do usuário (Como ainda não temos banco de dados de usuário, mantemos no TS)
  veiculoAtual = {
    marca: 'BYD',
    modelo: 'Dolphin',
    conectores: ['Tipo 2', 'CCS2']
  };

  constructor(
    private router: Router, 
    private estacaoService: EstacaoService
  ) {}

  ngOnInit(): void {
    this.carregarDadosInteligentes();
  }

  private carregarDadosInteligentes(): void {
    this.estacaoService.getEstacoesSalvador().subscribe({
      next: (dados: any[]) => {
        // 1. Total de Estações Ativas
        this.totalEstacoes = dados.length;

        // 2. Estações em um raio de 5km (A API já retorna a distância baseada na nossa latitude/longitude!)
        this.estacoesRaio5km = dados.filter(posto => posto.AddressInfo?.Distance <= 5).length;

        // 3. Quantidade de Shoppings (Verifica se o nome ou endereço tem a palavra 'shopping')
        this.shoppings = dados.filter(posto => 
          posto.AddressInfo?.Title?.toLowerCase().includes('shopping') || 
          posto.AddressInfo?.AddressLine1?.toLowerCase().includes('shopping')
        ).length;

        // 4. Rede Rápida DC (LevelID 3 é carga rápida no OpenChargeMap, ou mais de 22kW)
        this.redeRapidaDC = dados.filter(posto => 
          posto.Connections?.some((conn: any) => conn.LevelID === 3 || conn.PowerKW >= 50)
        ).length;

        // 5. Pegar os 3 postos mais próximos para a lista de "Destaques/Recentes"
        this.postosRecentes = dados.slice(0, 3).map(posto => {
          // Lógica para definir a etiqueta visual (tag)
          const isShopping = posto.AddressInfo?.Title?.toLowerCase().includes('shopping');
          const isFast = posto.Connections?.some((conn: any) => conn.LevelID === 3 || conn.PowerKW >= 50);
          
          let tag = 'Público';
          let tagColor = 'text-neon'; // Verde
          if (isShopping) { tag = 'Shopping'; tagColor = 'text-purple'; }
          else if (isFast) { tag = 'Carga Rápida'; tagColor = 'text-blue'; }

          return {
            nome: posto.AddressInfo?.Title || 'Eletroposto',
            endereco: posto.AddressInfo?.AddressLine1 || 'Salvador, BA',
            distancia: posto.AddressInfo?.Distance ? posto.AddressInfo.Distance.toFixed(1) : 'N/A',
            tag: tag,
            tagColor: tagColor
          };
        });
      },
      error: (err) => {
        console.error('Falha ao buscar dados reais da API.', err);
      }
    });
  }

  abrirMapa() {
    alert('Futura navegação para a rota do Mapa de Tela Cheia!');
  }
}