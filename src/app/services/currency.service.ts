import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private apiUrl = 'https://open.er-api.com/v6/latest/USD';
  private rates: { [key: string]: number } = { USD: 1 };

  constructor(private http: HttpClient) {}

  fetchRates(): Observable<{ [key: string]: number }> {
    if (Object.keys(this.rates).length > 1) {
      return of(this.rates);
    }
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => {
        this.rates = res.rates || { USD: 1 };
        return this.rates;
      }),
      catchError(() => of(this.rates))
    );
  }

  getRate(currency: string): Observable<number> {
    return this.fetchRates().pipe(map(rates => rates[currency] || 1));
  }

  convertToUSD(amount: number, currency: string): Observable<number> {
    return this.getRate(currency).pipe(map(rate => amount / rate));
  }
} 