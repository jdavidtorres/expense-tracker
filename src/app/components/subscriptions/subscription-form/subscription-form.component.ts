import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from '../../../models/expense.model';
import { ExpenseService } from '../../../services/expense.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './subscription-form.component.html'
})
export class SubscriptionFormComponent implements OnInit {
  @Input() subscription: Partial<Subscription> = {};
  @Input() isVisible = false;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  categories = [
    'Entertainment',
    'Utilities',
    'Software',
    'Cloud Services',
    'Streaming',
    'Education',
    'Health',
    'Finance',
    'Shopping',
    'Other'
  ];

  frequencies = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'daily', label: 'Daily' }
  ];

  billingCycles = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  isEdit = false;
  loading = false;
  error: string | null = null;

  model: Partial<Subscription> = {
    name: '',
    amount: 0,
    category: '',
    paymentDate: new Date(),
    isRecurring: true,
    frequency: 'monthly',
    billingCycle: 'monthly',
    startDate: new Date(),
    isActive: true,
    type: 'subscription'
  };

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    if (this.subscription && this.subscription.id) {
      this.isEdit = true;
      this.model = { ...this.subscription };
    } else {
      // Set default category if available
      if (this.categories.length > 0) {
        this.model.category = this.categories[0];
      }
    }
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.error = null;

    const subscriptionData = {
      ...this.model,
      amount: Number(this.model.amount),
      paymentDate: this.model.paymentDate as Date,
      startDate: this.model.startDate as Date,
      endDate: this.model.endDate as Date
    };

    const subscription$ = this.isEdit
      ? this.expenseService.updateSubscription(subscriptionData as Subscription)
      : this.expenseService.addSubscription(subscriptionData as Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>);

    subscription$.subscribe({
      next: () => {
        this.saved.emit();
        this.resetForm();
      },
      error: (err) => {
        this.error = this.isEdit
          ? 'Failed to update subscription'
          : 'Failed to create subscription';
        console.error('Subscription error:', err);
        this.loading = false;
      }
    });
  }  onCancel(): void {
    this.cancelled.emit();
    this.resetForm();
  }

  private isFormValid(): boolean {
    return !!(
      this.model.name &&
      this.model.amount &&
      this.model.amount > 0 &&
      this.model.category &&
      this.model.paymentDate &&
      this.model.startDate
    );
  }

  private formatDateForApi(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private resetForm(): void {
    this.model = {
      name: '',
      amount: 0,
      category: this.categories[0] || '',
      paymentDate: new Date(),
      isRecurring: true,
      frequency: 'monthly',
      billingCycle: 'monthly',
      startDate: new Date(),
      isActive: true,
      type: 'subscription'
    };
    this.isEdit = false;
    this.loading = false;
    this.error = null;
  }
}
