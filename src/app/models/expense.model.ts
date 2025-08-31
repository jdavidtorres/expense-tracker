export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  paymentDate: Date;
  dueDate?: Date;
  isRecurring: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription extends Expense {
  type: 'subscription';
  billingCycle: 'monthly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

export interface Invoice extends Expense {
  type: 'invoice';
  invoiceNumber: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  attachmentUrl?: string;
}

export interface ExpensesSummary {
  total: number;
  byCategory: { [key: string]: number };
  monthlyAverage: number;
  yearlyTotal: number;
}

export interface TimePeriodSummary {
  period: string;
  amount: number;
  category: string;
}
