import { ExpenseService } from './expense.service';
import { Expense } from '../model/expense.model';

describe('ExpenseService', () => {
  let service: ExpenseService;
  beforeEach(() => {
    service = new ExpenseService();
    service.clearAll();
  });

  it('should paginate expenses correctly', () => {
    for (let i = 1; i <= 25; i++) {
      service.add({
        id: i.toString(),
        category: 'Test',
        amount: i,
        currency: 'USD',
        date: '2024-01-01',
        createdAt: '2024-01-01',
        usdAmount: i
      } as Expense);
    }
    const page1 = service.getPaginated(1, 10);
    const page2 = service.getPaginated(2, 10);
    expect(page1.items.length).toBe(10);
    expect(page2.items.length).toBe(10);
    expect(page1.items[0].id).toBe('25'); // Most recent first
    expect(page2.items[0].id).toBe('15');
  });
}); 