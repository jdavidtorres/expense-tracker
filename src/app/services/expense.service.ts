import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Expense, Subscription, Invoice, ExpensesSummary } from '../models/expense.model';

const API_BASE_URL = 'http://localhost:8083/api';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  constructor(private http: HttpClient) {}

  // Subscription Methods
  getSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${API_BASE_URL}/subscriptions`).pipe(
      catchError(this.handleError<Subscription[]>('getSubscriptions', []))
    );
  }

  getSubscription(id: string): Observable<Subscription> {
    return this.http.get<Subscription>(`${API_BASE_URL}/subscriptions/${id}`).pipe(
      catchError(this.handleError<Subscription>(`getSubscription id=${id}`))
    );
  }

  addSubscription(subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>): Observable<Subscription> {
    return this.http.post<Subscription>(
      `${API_BASE_URL}/subscriptions`,
      subscription,
      httpOptions
    ).pipe(
      catchError(this.handleError<Subscription>('addSubscription'))
    );
  }

  updateSubscription(subscription: Subscription): Observable<Subscription> {
    return this.http.put<Subscription>(
      `${API_BASE_URL}/subscriptions/${subscription.id}`,
      subscription,
      httpOptions
    ).pipe(
      catchError(this.handleError<Subscription>('updateSubscription'))
    );
  }

  deleteSubscription(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${API_BASE_URL}/subscriptions/${id}`).pipe(
      catchError(this.handleError<boolean>('deleteSubscription', false))
    );
  }

  // Invoice Methods
  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${API_BASE_URL}/invoices`).pipe(
      catchError(this.handleError<Invoice[]>('getInvoices', []))
    );
  }

  getInvoice(id: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${API_BASE_URL}/invoices/${id}`).pipe(
      catchError(this.handleError<Invoice>(`getInvoice id=${id}`))
    );
  }

  addInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Observable<Invoice> {
    return this.http.post<Invoice>(
      `${API_BASE_URL}/invoices`,
      invoice,
      httpOptions
    ).pipe(
      catchError(this.handleError<Invoice>('addInvoice'))
    );
  }

  updateInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.put<Invoice>(
      `${API_BASE_URL}/invoices/${invoice.id}`,
      invoice,
      httpOptions
    ).pipe(
      catchError(this.handleError<Invoice>('updateInvoice'))
    );
  }

  deleteInvoice(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${API_BASE_URL}/invoices/${id}`).pipe(
      catchError(this.handleError<boolean>('deleteInvoice', false))
    );
  }

  // Summary and Reports
  getMonthlySummary(year: number, month: number): Observable<ExpensesSummary> {
    return this.http.get<ExpensesSummary>(`${API_BASE_URL}/summary/monthly?year=${year}&month=${month}`).pipe(
      catchError(this.handleError<ExpensesSummary>('getMonthlySummary', {
        total: 0,
        byCategory: {},
        monthlyAverage: 0,
        yearlyTotal: 0
      }))
    );
  }

  getYearlySummary(year: number): Observable<ExpensesSummary> {
    return this.http.get<ExpensesSummary>(`${API_BASE_URL}/summary/yearly?year=${year}`).pipe(
      catchError(this.handleError<ExpensesSummary>('getYearlySummary', {
        total: 0,
        byCategory: {},
        monthlyAverage: 0,
        yearlyTotal: 0
      }))
    );
  }

  // Upload invoice file
  uploadInvoiceFile(file: File): Observable<{fileUrl: string}> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<{fileUrl: string}>(
      `${API_BASE_URL}/invoices/upload`,
      formData
    ).pipe(
      catchError(this.handleError<{fileUrl: string}>('uploadInvoiceFile', { fileUrl: '' }))
    );
  }

  // Error handling
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
