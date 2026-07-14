import { Injectable } from '@angular/core';
import { Estacao } from '../models/estacao.model';

@Injectable({
  providedIn: 'root'
})
export class EstacaoService {

  private readonly postosSalvador: Estacao[] = [
    { lat: -12.9770498, lon: -38.4552313, nome: 'Eletroposto Salvador Shopping', endereco: 'Av. Tancredo Neves, 3133', isShopping: true, isFast: false, potencia: '22 kW', conector: 'Tipo 2', comodidades: ['food', 'wc'] },
    { lat: -12.9810603, lon: -38.4648867, nome: 'Recarga Shopping da Bahia', endereco: 'Av. Tancredo Neves, 148', isShopping: true, isFast: true, potencia: '150 kW', conector: 'CCS2', comodidades: ['food', 'wifi', 'wc'] },
    { lat: -13.0068662, lon: -38.5253917, nome: 'Tupinambá Shopping Barra', endereco: 'Av. Centenário, 2992', isShopping: true, isFast: false, potencia: '22 kW', conector: 'Tipo 2', comodidades: ['food', 'wc', 'pet'], alertaAtual: { tipo: 'Fila Longa', tempo: 'Há 5 min' } },
    { lat: -12.9356626, lon: -38.3947840, nome: 'Eletroposto Shopping Paralela', endereco: 'Av. Luís Viana Filho, 8544', isShopping: true, isFast: false, potencia: '22 kW', conector: 'Tipo 2' },
    { lat: -12.8873507, lon: -38.3185476, nome: 'EZVolt Parque Shopping Bahia', endereco: 'R. Maria Tavares de Resende, 82', isShopping: true, isFast: true, potencia: '50 kW', conector: 'CCS2' },
    { lat: -12.9154726, lon: -38.3350893, nome: 'Neoenergia Aeroporto', endereco: 'Praça Gago Coutinho, s/n', isShopping: false, isFast: true, potencia: '50 kW', conector: 'CCS2', comodidades: ['cafe', 'wc'] },
    { lat: -12.9765655, lon: -38.4700486, nome: 'Concessionária Ford Indiana', endereco: 'Av. Antônio Carlos Magalhães, 3213', isShopping: false, isFast: true, potencia: '120 kW', conector: 'CCS2', comodidades: ['wifi'] },
    { lat: -12.964267, lon: -38.472772, nome: 'Concessionária Ford Slaviero', endereco: 'Av. Barros Reis, 1876', isShopping: false, isFast: true, potencia: '100 kW', conector: 'CCS2' },
    { lat: -13.0067957, lon: -38.4928928, nome: 'Hospital Mater Dei', endereco: 'Rio Vermelho', isShopping: false, isFast: false, potencia: '22 kW', conector: 'Tipo 2', comodidades: ['cafe', 'wifi', 'wc'] },
    { lat: -12.9759872, lon: -38.5136572, nome: 'Fera Palace Hotel', endereco: 'R. Chile, 20', isShopping: false, isFast: false, potencia: '7 kW', conector: 'Tipo 2', comodidades: ['cafe', 'wifi', 'wc', 'pet'] },
    { lat: -12.9880918, lon: -38.4484365, nome: 'Pão de Açúcar Costa Azul', endereco: 'R. Arthur Machado, 1475', isShopping: false, isFast: false, potencia: '22 kW', conector: 'Tipo 2', comodidades: ['food'] },
    { lat: -12.9381529, lon: -38.3871764, nome: 'Senai Cimatec', endereco: 'Av. Orlando Gomes, 1845', isShopping: false, isFast: true, potencia: '150 kW', conector: 'CCS2', comodidades: ['wifi', 'cafe'] },
    { lat: -12.8247327, lon: -38.2675733, nome: 'Outlet Premium Salvador', endereco: 'Estrada do Coco', isShopping: true, isFast: true, potencia: '50 kW', conector: 'CCS2', comodidades: ['food', 'wc', 'pet'] },
    { lat: -12.9705734, lon: -38.4810465, nome: 'Assaí Atacadista Rótula', endereco: 'Rótula do Abacaxi', isShopping: false, isFast: false, potencia: '22 kW', conector: 'Tipo 2' }
  ];

  getEstacoes(): Estacao[] {
    return [...this.postosSalvador];
  }

  calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const raioTerraKm = 6371; 
    const deltaLat = (lat2 - lat1) * Math.PI / 180;
    const deltaLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
              
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return raioTerraKm * c; 
  }
}