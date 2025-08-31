# Expense Tracker - AI Coding Guidelines

## Architecture Overview
Angular 20 standalone application for tracking subscriptions and invoices.

**Key Components:**
- `ExpenseService` - Central service for API communication to `localhost:8083`
- Standalone components with explicit imports
- Data models: `Expense`, `Subscription`, `Invoice` with inheritance
- Dashboard with expense summaries and category breakdowns

## Core Patterns

### Component Structure
```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './example.component.html'
})
```

### Control Flow Syntax (Angular 17+)
Use new control flow syntax instead of structural directives:

```html
@if (loading) {
  <div class="alert alert-info">Loading...</div>
} @else if (error) {
  <div class="alert alert-danger">{{ error }}</div>
}

@for (category of categories; track category) {
  <tr><td>{{ category }}</td></tr>
} @empty {
  <tr><td>No data found</td></tr>
}
```

### Service API Calls
```typescript
this.http.get<Subscription[]>(`${API_BASE_URL}/subscriptions`)
  .pipe(catchError(this.handleError<Subscription[]>('getSubscriptions', [])))
```

### Error Handling
```typescript
private handleError<T>(operation = 'operation', result?: T): Observable<T> {
  return (error: any): Observable<T> => {
    console.error(`${operation} failed:`, error);
    return of(result as T);
  };
}
```

### Formatting Utilities
```typescript
formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 2
  }).format(amount);
}

formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}
```

## Best Practices & Standards

### TypeScript Standards
- Use strict mode and strong typing
- Avoid `any` type - use interfaces and union types
- Use optional chaining (`?.`) and nullish coalescing (`??`)

### Angular Best Practices
- Use standalone components and new control flow syntax
- Implement `OnPush` change detection for performance
- Always unsubscribe observables in `ngOnDestroy`
- Use signals for reactive state management

```typescript
// Proper cleanup
private destroy$ = new Subject<void>();
ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}

// Signals for state
private readonly loading = signal(false);
private readonly error = signal<string | null>(null);
```

### Code Quality
- Follow DRY principle and single responsibility
- Use consistent naming: camelCase for variables, PascalCase for classes
- Add JSDoc for public APIs
- Handle errors with user-friendly messages

### Security & Performance
- Validate inputs on client and server
- Use Angular's built-in sanitization
- Clean up subscriptions and event listeners
- Never expose sensitive data in client code

## Development Workflow

### Building the App
```bash
npm install
ng build
```

### Key Files to Reference
- `src/app/models/expense.model.ts` - Data interfaces
- `src/app/services/expense.service.ts` - API service patterns
- `src/app/components/subscriptions/subscriptions.component.ts` - CRUD example
- `src/app/components/dashboard/dashboard.component.ts` - Data loading patterns

## Specific Conventions

### UI Components
- Bootstrap 5 classes for styling
- Lucide icons: `import { Plus, Edit, Trash2 } from 'lucide-angular'`
- ngx-toastr for notifications
- Consistent loading/error state handling

### Data Management
- All API calls through ExpenseService
- RxJS observables for async operations
- Proper error boundaries with fallback data
- Update local state after successful operations

### Forms
- Template-driven forms with ngModel
- Validate required fields before submission
- Reset forms after operations
- Support create and edit modes

### Navigation
- Angular Router with standalone setup
- Routes in `app.routes.ts`
- Default redirect to `/dashboard`

## Common Patterns

### Loading and Error States
```typescript
loading = true;
error: string | null = null;

this.service.getData().subscribe({
  next: (data) => this.loading = false,
  error: (err) => {
    this.error = 'Failed to load data';
    this.loading = false;
  }
});
```

### CRUD Operations
```typescript
addItem(item: Item): void {
  this.service.addItem(item).subscribe({
    next: () => this.loadItems(),
    error: (err) => this.error = 'Failed to add item'
  });
}

deleteItem(id: string): void {
  if (confirm('Are you sure?')) {
    this.service.deleteItem(id).subscribe({
      next: () => this.loadItems(),
      error: (err) => this.error = 'Failed to delete item'
    });
  }
}
```

## Dependencies
- **Angular 20+** with standalone components
- **Bootstrap 5** for styling and responsive design
- **Lucide Angular** for consistent iconography
- **Chart.js** and **ng2-charts** for data visualization
- **ngx-toastr** for user notifications
- **date-fns** for date manipulation utilities
- **RxJS** for reactive programming and async operations
- **Angular Animations** for UI transitions

## Backend Integration
- REST API at `http://localhost:8083/api`
- Endpoints: `/subscriptions`, `/invoices`, `/summary/monthly`, `/summary/yearly`
- File upload support for invoice attachments
