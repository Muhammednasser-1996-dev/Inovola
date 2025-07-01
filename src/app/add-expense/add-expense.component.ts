import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Expense } from '../model/expense.model';
import { CurrencyService } from '../services/currency.service';
import { v4 as uuidv4 } from 'uuid';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../services/expense.service';
import { Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToastModule, TranslateModule, RouterLink],
  providers: [MessageService],
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss']
})
export class AddExpenseComponent {
  expenseForm: FormGroup;
  categories: string[] = [
    'Groceries', 'Entertainment', 'Gas', 'Shopping',
    'News Paper', 'Transport', 'Rent', 'Add Category'
  ];
  selectedCategory: string = this.categories[0];
  currencies: string[] = ['USD', 'EUR', 'EGP'];
  receiptUrl: string | undefined;
  dragOver: boolean = false;
  type: 'income' | 'expense' = 'expense';

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private currencyService: CurrencyService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.expenseForm = this.fb.group({
      category: [this.selectedCategory, Validators.required],
      amount: [null, [Validators.required, this.amountTypeValidator.bind(this)]],
      date: [null, Validators.required],
      currency: ['USD', Validators.required],
      receipt: [null]
    });
  }

  amountTypeValidator(control: AbstractControl) {
    const value = control.value;
    if (value == null || value === '') return null;
    if (this.type === 'expense' && value >= 0) {
      return { notNegative: true };
    }
    if (this.type === 'income' && value <= 0) {
      return { notPositive: true };
    }
    return null;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.expenseForm.patchValue({ category });
  }

  setType(type: 'income' | 'expense'): void {
    this.type = type;
    this.expenseForm.get('amount')?.updateValueAndValidity();
  }

  onFileChange(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.readFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.readFile(event.dataTransfer.files[0]);
    }
  }

  readFile(file: File): void {
    const reader: FileReader = new FileReader();
    reader.onload = () => {
      this.receiptUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  deleteImage(): void {
    this.receiptUrl = undefined;
  }

  onSubmit(): void {
    if (this.expenseForm.invalid) return;
    const formValue = this.expenseForm.value;
    const amount = formValue.amount;
    const expense: Expense = {
      id: uuidv4(),
      category: formValue.category,
      amount: amount,
      currency: formValue.currency,
      date: formValue.date,
      receiptUrl: this.receiptUrl,
      createdAt: new Date().toISOString()
    };
    this.currencyService.convertToUSD(expense.amount, expense.currency).subscribe((usdAmount: number) => {
      expense.usdAmount = usdAmount;
      this.expenseService.add(expense);
      this.messageService.add({severity:'success', summary:'Success', detail:'Expense added successfully!'});
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1200);
    });
  }
} 