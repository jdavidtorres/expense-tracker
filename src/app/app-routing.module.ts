import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { ReportsComponent } from './components/reports/reports.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'subscriptions', component: SubscriptionsComponent },
  { path: 'invoices', component: InvoicesComponent },
  { path: 'reports', component: ReportsComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
