import { Injectable } from '@angular/core';
import { Expense } from '../model/expense.model';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private storageKey = 'expenses';

  getAll(): Expense[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  add(expense: Expense): void {
    const expenses = this.getAll();
    expenses.unshift(expense);
    localStorage.setItem(this.storageKey, JSON.stringify(expenses));
  }

  getPaginated(page: number, pageSize: number, filterFn?: (e: Expense) => boolean): { items: Expense[], total: number } {
    let expenses = this.getAll();
    if (filterFn) {
      expenses = expenses.filter(filterFn);
    }
    const total = expenses.length;
    const items = expenses.slice((page - 1) * pageSize, page * pageSize);
    return { items, total };
  }

  clearAll(): void {
    localStorage.removeItem(this.storageKey);
  }
} 