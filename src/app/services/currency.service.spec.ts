import { TestBed } from '@angular/core/testing';
import { CurrencyService } from './currency.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CurrencyService]
    });
    service = TestBed.inject(CurrencyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should convert to USD using mocked rate', (done) => {
    service['rates'] = { USD: 1, EUR: 2 };
    service.convertToUSD(20, 'EUR').subscribe(usd => {
      expect(usd).toBe(10);
      done();
    });
  });

  it('should fetch rates from API', (done) => {
    service.fetchRates().subscribe(rates => {
      expect(rates.USD).toBe(1);
      expect(rates.EUR).toBe(2);
      done();
    });
    const req = httpMock.expectOne('https://open.er-api.com/v6/latest/USD');
    req.flush({ rates: { USD: 1, EUR: 2 } });
  });
}); 