import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from '../summary/summary.component';
import { StatementListComponent } from '../statement-list/statement-list.component';
import { FilterComponent } from '../filter/filter.component';
import { ResumenNacionalInternacionalComponent } from '../resumen-nacional-internacional/resumen-nacional-internacional.component';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { Summary, AccountStatement, ResumenNacional, ResumenInternacional } from '../models';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SummaryComponent, StatementListComponent, FilterComponent, ResumenNacionalInternacionalComponent, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  summary: Summary | null = null;
  adjustedSummary: Summary | null = null;
  resumenNacional: ResumenNacional | null = null;
  resumenInternacional: ResumenInternacional | null = null;
  accountStatements: AccountStatement[] = [];
  selectedMonth: string = '';
  private paidAmount: number = 0;
  showConfirmModal: boolean = false;

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
    this.paidAmount = 0;
    
    this.apiService.getAccountStatements({ mesEmision }).subscribe({
      next: (data) => {
        this.summary = data.resumen;
        this.resumenNacional = data.resumenNacional || null;
        this.resumenInternacional = data.resumenInternacional || null;
        this.accountStatements = data.estadosDeCuenta || [];
        this.updateAdjustedSummary();
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        this.accountStatements = [];
        this.resumenNacional = null;
        this.resumenInternacional = null;
        this.adjustedSummary = null;
      }
    });
  }

  private loadPaidAmount(): void {
    if (!this.selectedMonth || !this.accountStatements.length) {
      this.paidAmount = 0;
      return;
    }

    const storageKey = `paidStatements_${this.selectedMonth}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        const paidIds = JSON.parse(stored) as number[];
        this.paidAmount = this.accountStatements
          .filter(s => paidIds.includes(s.id))
          .reduce((sum, s) => sum + s.montoAPagar, 0);
      } catch (error) {
        console.error('Error al cargar montos pagados:', error);
        this.paidAmount = 0;
      }
    } else {
      this.paidAmount = 0;
    }
  }

  private updateAdjustedSummary(): void {
    if (!this.summary) {
      this.adjustedSummary = null;
      return;
    }

    this.loadPaidAmount();
    
    this.adjustedSummary = {
      ...this.summary,
      montoTotalAPagar: Math.max(0, this.summary.montoTotalAPagar - this.paidAmount)
    };
  }

  onPaymentToggled(event: { statementId: number; isPaid: boolean; amount: number }): void {
    if (event.isPaid) {
      this.paidAmount += event.amount;
    } else {
      this.paidAmount -= event.amount;
    }
    
    this.updateAdjustedSummary();
  }

  onMonthSelected(mesEmision: string) {
    this.fetchData(mesEmision);
  }

  logout(): void {
    this.authService.logout();
  }

  clearLocalStorage(): void {
    this.showConfirmModal = true;
  }

  confirmClearStorage(): void {
    // Limpiar todas las claves relacionadas con pagos
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('paidStatements_')) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Actualizar el estado actual
    this.paidAmount = 0;
    this.updateAdjustedSummary();

    // Refrescar la tabla forzando recarga de datos
    if (this.selectedMonth) {
      this.fetchData(this.selectedMonth);
    }

    this.showConfirmModal = false;
  }

  cancelClearStorage(): void {
    this.showConfirmModal = false;
  }
}
