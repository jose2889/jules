import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from '../summary/summary.component';
import { StatementListComponent } from '../statement-list/statement-list.component';
import { FilterComponent } from '../filter/filter.component';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { Summary, AccountStatement } from '../models';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SummaryComponent, StatementListComponent, FilterComponent, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  summary: Summary | null = null;
  accountStatements: AccountStatement[] = [];
  selectedMonth: string = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // El filtro emitirá automáticamente el mes actual al inicializarse
    // No es necesario cargar datos aquí ya que onMonthSelected se llamará
  }

  fetchData(mesEmision: string) {
    this.selectedMonth = mesEmision;
    this.apiService.getAccountStatements({ mesEmision }).subscribe({
      next: (data) => {
        this.summary = data.resumen;
        this.accountStatements = data.estadosDeCuenta || [];
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        this.accountStatements = [];
      }
    });
  }

  onMonthSelected(mesEmision: string) {
    this.fetchData(mesEmision);
  }

  logout(): void {
    this.authService.logout();
  }
}
