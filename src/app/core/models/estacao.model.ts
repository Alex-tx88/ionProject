export interface Estacao {
  lat: number;
  lon: number;
  nome: string;
  endereco: string;
  isShopping: boolean;
  isFast: boolean;
  potencia?: string;
  conector?: string;
  distancia?: string;
  tag?: string;
  tagColor?: string;
  comodidades?: string[];
  alertaAtual?: { tipo: string, tempo: string };
}

export interface Notificacao {
  titulo: string;
  mensagem: string;
  tempo: string;
  lida: boolean;
}

export interface Veiculo {
  marca: string;
  modelo: string;
  conectores: string[];
}