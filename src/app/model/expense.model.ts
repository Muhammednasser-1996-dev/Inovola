export interface Expense {
  id: string;
  category: string;
  amount: number;
  currency: string;
  date: string;
  receiptUrl?: string;
  createdAt: string;
  usdAmount?: number;
} 