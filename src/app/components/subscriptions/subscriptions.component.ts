import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { Subscription } from '../../models/expense.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { SubscriptionFormComponent } from './subscription-form/subscription-form.component';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LucideAngularModule,
    SubscriptionFormComponent
  ],
  templateUrl: './subscriptions.component.html'
})
export class SubscriptionsComponent implements OnInit {
  subscriptions: Subscription[] = [];
  filteredSubscriptions: Subscription[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';

  // Filters
  showActive = true;
  showInactive = false;
  selectedCategory = 'all';
  categories: string[] = [];

  // Form state
  showForm = false;
  editingSubscription: Partial<Subscription> | null = null;

  constructor(
    private expenseService: ExpenseService
  ) {}

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    this.loading = true;
    this.error = null;

    this.expenseService.getSubscriptions().subscribe({
      next: (data) => {
        this.subscriptions = data;
        this.filteredSubscriptions = [...data];
        this.extractCategories();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load subscriptions';
        this.loading = false;
        console.error('Error loading subscriptions:', err);
      }
    });
  }

  extractCategories(): void {
    const categorySet = new Set<string>();
    this.subscriptions.forEach(sub => {
      if (sub.category) {
        categorySet.add(sub.category);
      }
    });
    this.categories = Array.from(categorySet).sort();
  }

  applyFilters(): void {
    this.filteredSubscriptions = this.subscriptions.filter(sub => {
      // Filter by active/inactive
      if (sub.isActive && !this.showActive) return false;
      if (!sub.isActive && !this.showInactive) return false;

      // Filter by category
      if (this.selectedCategory !== 'all' && sub.category !== this.selectedCategory) {
        return false;
      }

      // Filter by search term
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        return (
          sub.name.toLowerCase().includes(searchLower) ||
          (sub.notes && sub.notes.toLowerCase().includes(searchLower))
        );
      }

      return true;
    });
  }

  openAddSubscription(): void {
    this.editingSubscription = null;
    this.showForm = true;
  }

  openEditSubscription(subscription: Subscription): void {
    this.editingSubscription = subscription;
    this.showForm = true;
  }

  onFormSaved(): void {
    this.showForm = false;
    this.editingSubscription = null;
    this.loadSubscriptions();
  }

  onFormCancelled(): void {
    this.showForm = false;
    this.editingSubscription = null;
  }

  deleteSubscription(id: string): void {
    if (confirm('Are you sure you want to delete this subscription? This action cannot be undone.')) {
      this.expenseService.deleteSubscription(id).subscribe({
        next: () => {
          this.loadSubscriptions();
        },
        error: (err) => {
          this.error = 'Failed to delete subscription';
          console.error('Error deleting subscription:', err);
        }
      });
    }
  }

  toggleSubscriptionStatus(subscription: Subscription): void {
    const updatedSubscription = {
      ...subscription,
      isActive: !subscription.isActive
    };

    this.expenseService.updateSubscription(updatedSubscription).subscribe({
      next: () => {
        this.loadSubscriptions();
      },
      error: (err) => {
        this.error = 'Failed to update subscription status';
        console.error('Error updating subscription status:', err);
      }
    });
  }

  getStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'bg-success' : 'bg-secondary';
  }

  getDaysUntilPayment(dateValue: string | Date): string {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    const today = new Date();
    // Zero out time for accurate diff
    const d1 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const d2 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffMs = d2.getTime() - d1.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Due today';
    if (diffDays > 0) return `${diffDays} day${diffDays === 1 ? '' : 's'} left`;
    const overdue = Math.abs(diffDays);
    return `${overdue} day${overdue === 1 ? '' : 's'} overdue`;
  }

  getMonthlyTotal(): number {
    // Sum monthly cost estimation. If billingCycle is yearly, spread over 12 months
    return this.filteredSubscriptions.reduce((sum, s) => {
      const amt = Number(s.amount) || 0;
      const perMonth = s.billingCycle === 'yearly' ? amt / 12 : amt;
      return sum + perMonth;
    }, 0);
  }

  formatDate(dateString: string | Date): string {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  }
}
