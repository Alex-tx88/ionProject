import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstacaoService {
  private apiUrl = 'https://api.openchargemap.io/v3/poi';
  private apiKey = '85c9a037-775c-4cd5-bc44-59e519c25608'; // Sua chave (ou de testes)

  constructor(private http: HttpClient) {}

  getEstacoesSalvador(): Observable<any> {
    const params = new HttpParams()
      .set('output', 'json')
      .set('countrycode', 'BR')
      .set('latitude', '-12.9714') // Centro de Salvador
      .set('longitude', '-38.5114')
      .set('distance', '30') // Aumentamos para 30km para pegar toda a cidade
      .set('distanceunit', 'KM')
      .set('maxresults', '100')
      .set('key', this.apiKey);

    return this.http.get<any>(this.apiUrl, { params });
  }
}