import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { ExpensesSummary } from '../../models/expense.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  currentMonth = this.currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  
  monthlySummary: ExpensesSummary = {
    total: 0,
    byCategory: {},
    monthlyAverage: 0,
    yearlyTotal: 0
  };
  
  yearlySummary: ExpensesSummary = {
    total: 0,
    byCategory: {},
    monthlyAverage: 0,
    yearlyTotal: 0
  };
  
  loading = true;
  error: string | null = null;

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;
    
    this.expenseService.getMonthlySummary(this.currentYear, this.currentMonth)
      .subscribe({
        next: (data) => {
          this.monthlySummary = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load monthly summary';
          this.loading = false;
          console.error('Error loading monthly summary:', err);
        }
      });
      
    this.expenseService.getYearlySummary(this.currentYear)
      .subscribe({
        next: (data) => {
          this.yearlySummary = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load yearly summary';
          this.loading = false;
          console.error('Error loading yearly summary:', err);
        }
      });
  }

  getMonthName(month: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  }

  getCategoryKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  }
}
