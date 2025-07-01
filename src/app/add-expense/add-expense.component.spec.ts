import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AddExpenseComponent } from './add-expense.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ExpenseService } from '../services/expense.service';
import { CurrencyService } from '../services/currency.service';
import { of } from 'rxjs';

class MockExpenseService {
  add = jasmine.createSpy('add');
}
class MockCurrencyService {
  convertToUSD = jasmine.createSpy('convertToUSD').and.returnValue(of(10));
}

describe('AddExpenseComponent', () => {
  let component: AddExpenseComponent;
  let fixture: ComponentFixture<AddExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AddExpenseComponent],
      providers: [
        { provide: ExpenseService, useClass: MockExpenseService },
        { provide: CurrencyService, useClass: MockCurrencyService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AddExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have an invalid form when required fields are missing', () => {
    component.expenseForm.setValue({ category: '', amount: null, date: null, currency: '', receipt: null });
    expect(component.expenseForm.invalid).toBeTrue();
  });

  it('should have a valid form with correct values', () => {
    component.expenseForm.setValue({ category: 'Groceries', amount: 100, date: '2024-01-01', currency: 'USD', receipt: null });
    expect(component.expenseForm.valid).toBeTrue();
  });

  it('should call ExpenseService.add and CurrencyService.convertToUSD on submit', () => {
    component.expenseForm.setValue({ category: 'Groceries', amount: 100, date: '2024-01-01', currency: 'USD', receipt: null });
    component.onSubmit();
    expect(MockCurrencyService.prototype.convertToUSD).toHaveBeenCalledWith(100, 'USD');
    expect(MockExpenseService.prototype.add).toHaveBeenCalled();
  });
}); 