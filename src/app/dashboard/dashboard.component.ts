import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from '../summary/summary.component';
import { StatementListComponent } from '../statement-list/statement-list.component';
import { FilterComponent } from '../filter/filter.component';
import { ApiService } from '../api.service';
import { Summary, AccountStatement } from '../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SummaryComponent, StatementListComponent, FilterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  summary: Summary | null = null;
  accountStatements: AccountStatement[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchData('2025-09');
  }

  fetchData(mesEmision: string) {
    this.apiService.getAccountStatements({ mesEmision }).subscribe(data => {
      this.summary = data.resumen;
      this.accountStatements = data.estadosDeCuenta;
    });
  }

  onMonthSelected(mesEmision: string) {
    this.fetchData(mesEmision);
  }
}
