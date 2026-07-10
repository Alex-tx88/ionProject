import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EstacaoService {
  
  // Nosso Banco de Dados Local para garantir que a tela nunca fique vazia!
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

  constructor() {}

  getEstacoesSalvador(): Observable<any> {
    // Retorna os dados com um atraso de meio segundo para dar aquele efeito de carregamento premium
    return of(this.postosSalvador).pipe(delay(500));
  }
}