import { Component } from '@angular/core';
import { Expense } from '../model/expense.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../services/expense.service';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule, DropdownModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  expenses: Expense[] = [];
  page: number = 1;
  pageSize: number = 10;
  total: number = 0;
  filter: string = 'all';
  filters: { label: string; value: string }[] = [
    { label: 'All Time', value: 'all' },
    { label: 'This month', value: 'month' },
    { label: 'Last 7 Days', value: '7days' }
  ];

  totalBalance: number = 0;
  totalIncome: number = 0;
  totalExpenses: number = 0;
  filteredUsdTotal: number = 0;

  categoryIcons: { [key: string]: string } = {
    'Groceries': '🛒',
    'Entertainment': '🎬',
    'Gas': '⛽',
    'Shopping': '🛍️',
    'News Paper': '📰',
    'Transport': '🚗',
    'Rent': '🏠',
    'Add Category': '➕'
  };
  categoryColors: { [key: string]: string } = {
    'Groceries': '#fbbf24',
    'Entertainment': '#a78bfa',
    'Gas': '#f87171',
    'Shopping': '#34d399',
    'News Paper': '#60a5fa',
    'Transport': '#f472b6',
    'Rent': '#f59e42',
    'Add Category': '#d1d5db'
  };

  langOptions = [
    { label: 'EN', value: 'en' },
    { label: 'AR', value: 'ar' }
  ];
  lang: string = localStorage.getItem('lang') || 'en';

  constructor(private expenseService: ExpenseService) {
    this.loadExpenses();
  }

  loadExpenses(): void {
    const filterFn = this.getFilterFn();
    const { items, total } = this.expenseService.getPaginated(this.page, this.pageSize, filterFn);
    this.expenses = items;
    this.total = total;
    this.calculateTotals();
    this.calculateFilteredUsdTotal();
  }

  getFilterFn(): ((e: Expense) => boolean) | undefined {
    const now: Date = new Date();
    if (this.filter === 'month') {
      const month: number = now.getMonth();
      const year: number = now.getFullYear();
      return (e: Expense) => {
        const d: Date = new Date(e.date);
        return d.getMonth() === month && d.getFullYear() === year;
      };
    } else if (this.filter === '7days') {
      const weekAgo: Date = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return (e: Expense) => new Date(e.date) >= weekAgo;
    }
    // 'all' or unknown
    return undefined;
  }

  onFilterChange(value: string): void {
    this.filter = value;
    this.page = 1;
    this.loadExpenses();
    this.calculateFilteredUsdTotal();
  }

  loadMore(): void {
    this.page++;
    const filterFn = this.getFilterFn();
    const { items } = this.expenseService.getPaginated(this.page, this.pageSize, filterFn);
    this.expenses = [...this.expenses, ...items];
  }

  calculateTotals(): void {
    const all: Expense[] = this.expenseService.getAll();
    this.totalBalance = all.reduce((sum: number, e: Expense) => sum + e.amount, 0);
    this.totalIncome = all.filter((e: Expense) => e.amount > 0).reduce((sum: number, e: Expense) => sum + e.amount, 0);
    this.totalExpenses = all.filter((e: Expense) => e.amount < 0).reduce((sum: number, e: Expense) => sum + Math.abs(e.amount), 0);
  }

  calculateFilteredUsdTotal(): void {
    const filterFn = this.getFilterFn();
    const all: Expense[] = this.expenseService.getAll();
    const filtered: Expense[] = filterFn ? all.filter(filterFn) : all;
    this.filteredUsdTotal = filtered.reduce((sum: number, e: Expense) => sum + (e.usdAmount || 0), 0);
  }

  getCategoryClass(category: string): string {
    return 'category-icon';
  }

  getCategoryIcon(category: string): string {
    return this.categoryIcons[category] || '❓';
  }

  getCategoryColor(category: string): string {
    return this.categoryColors[category] || '#e5e7eb';
  }

  onLangChange(lang: string): void {
    this.lang = lang;
    localStorage.setItem('lang', lang);
    window.location.reload(); // reload to apply language and direction
  }
} 