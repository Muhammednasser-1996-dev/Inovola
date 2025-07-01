import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'add-expense',
    loadComponent: () => import('./add-expense/add-expense.component').then(m => m.AddExpenseComponent)
  }
];
