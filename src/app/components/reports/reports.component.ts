import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { ExpensesSummary, TimePeriodSummary } from '../../models/expense.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LucideAngularModule
  ],
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit {
  currentDate = new Date();
  selectedYear = this.currentDate.getFullYear();
  selectedMonth = this.currentDate.getMonth() + 1;

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

  // Chart data
  categoryLabels: string[] = [];
  categoryValues: number[] = [];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loading = true;
    this.error = null;

    // Load monthly summary
    this.expenseService.getMonthlySummary(this.selectedYear, this.selectedMonth)
      .subscribe({
        next: (data) => {
          this.monthlySummary = data;
          this.updateChartData();
        },
        error: (err) => {
          this.error = 'Failed to load monthly summary';
          console.error('Error loading monthly summary:', err);
        }
      });

    // Load yearly summary
    this.expenseService.getYearlySummary(this.selectedYear)
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

  updateChartData(): void {
    this.categoryLabels = Object.keys(this.monthlySummary.byCategory);
    this.categoryValues = Object.values(this.monthlySummary.byCategory);
  }

  onYearChange(): void {
    this.loadReports();
  }

  onMonthChange(): void {
    this.loadReports();
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

  getTopCategories(limit: number = 5): { category: string; amount: number }[] {
    const categories = Object.entries(this.monthlySummary.byCategory)
      .map(([category, amount]) => ({ category, amount: amount as number }))
      .sort((a, b) => b.amount - a.amount);

    return categories.slice(0, limit);
  }

  getMonthlyTrend(): { month: string; amount: number }[] {
    // This would typically come from the backend
    // For now, return mock data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      amount: Math.random() * 2000 + 1000
    }));
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  }

  formatPercentage(value: number, total: number): string {
    if (total === 0) return '0%';
    return ((value / total) * 100).toFixed(1) + '%';
  }
}
