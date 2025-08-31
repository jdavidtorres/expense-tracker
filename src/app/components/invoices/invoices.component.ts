import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { Invoice } from '../../models/expense.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LucideAngularModule
  ],
  templateUrl: './invoices.component.html'
})
export class InvoicesComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';

  // Filters
  selectedStatus = 'all';
  selectedCategory = 'all';
  categories: string[] = [];
  statuses = ['paid', 'pending', 'overdue'];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.loading = true;
    this.error = null;

    this.expenseService.getInvoices().subscribe({
      next: (data) => {
        this.invoices = data;
        this.filteredInvoices = [...data];
        this.extractCategories();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load invoices';
        this.loading = false;
        console.error('Error loading invoices:', err);
      }
    });
  }

  extractCategories(): void {
    const categorySet = new Set<string>();
    this.invoices.forEach(invoice => {
      if (invoice.category) {
        categorySet.add(invoice.category);
      }
    });
    this.categories = Array.from(categorySet).sort();
  }

  applyFilters(): void {
    this.filteredInvoices = this.invoices.filter(invoice => {
      // Filter by status
      if (this.selectedStatus !== 'all' && invoice.paymentStatus !== this.selectedStatus) {
        return false;
      }

      // Filter by category
      if (this.selectedCategory !== 'all' && invoice.category !== this.selectedCategory) {
        return false;
      }

      // Filter by search term
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        return (
          invoice.name.toLowerCase().includes(searchLower) ||
          invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
          (invoice.notes && invoice.notes.toLowerCase().includes(searchLower))
        );
      }

      return true;
    });
  }

  openAddInvoice(): void {
    // TODO: Implement add invoice form
    console.warn('Add invoice UI not implemented yet.');
  }

  openEditInvoice(invoice: Invoice): void {
    // TODO: Implement edit invoice form
    console.warn('Edit invoice UI not implemented yet for', invoice?.name);
  }

  deleteInvoice(id: string): void {
    if (confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      this.expenseService.deleteInvoice(id).subscribe({
        next: () => {
          this.loadInvoices();
        },
        error: (err) => {
          this.error = 'Failed to delete invoice';
          console.error('Error deleting invoice:', err);
        }
      });
    }
  }

  updatePaymentStatus(invoice: Invoice, newStatus: 'paid' | 'pending' | 'overdue'): void {
    const updatedInvoice = {
      ...invoice,
      paymentStatus: newStatus
    };

    this.expenseService.updateInvoice(updatedInvoice).subscribe({
      next: () => {
        this.loadInvoices();
      },
      error: (err) => {
        this.error = 'Failed to update invoice status';
        console.error('Error updating invoice status:', err);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'paid': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'overdue': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getTotalAmount(): number {
    return this.filteredInvoices.reduce((sum, invoice) => sum + (Number(invoice.amount) || 0), 0);
  }

  getOverdueCount(): number {
    return this.filteredInvoices.filter(invoice => invoice.paymentStatus === 'overdue').length;
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
