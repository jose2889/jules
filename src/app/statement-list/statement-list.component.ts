import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AccountStatement } from '../models';
import { CommonModule } from '@angular/common';
import { CurrencySpacePipe } from '../currency-space.pipe';

@Component({
  selector: 'app-statement-list',
  standalone: true,
  imports: [CommonModule, CurrencySpacePipe],
  templateUrl: './statement-list.component.html',
  styleUrl: './statement-list.component.css'
})
export class StatementListComponent implements OnInit, OnChanges {
  @Input() statements: AccountStatement[] = [];
  @Input() selectedMonth: string = '';
  @Output() paymentToggled = new EventEmitter<{ statementId: number; isPaid: boolean; amount: number }>();
  
  paidStatements: Set<number> = new Set();

  ngOnInit() {
    this.loadPaidStatements();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedMonth'] && !changes['selectedMonth'].firstChange) {
      this.loadPaidStatements();
    }
    
    // Recargar estados pagados cuando cambian los statements
    if (changes['statements'] && !changes['statements'].firstChange) {
      this.loadPaidStatements();
    }
  }

  getFormattedMonth(): string {
    if (!this.selectedMonth) {
      return '';
    }

    const [year, month] = this.selectedMonth.split('-');
    const monthIndex = parseInt(month, 10) - 1;
    
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    return `${months[monthIndex]} ${year}`;
  }

  private getStorageKey(): string {
    return `paidStatements_${this.selectedMonth}`;
  }

  private loadPaidStatements(): void {
    if (!this.selectedMonth) {
      this.paidStatements.clear();
      return;
    }

    const storageKey = this.getStorageKey();
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        const ids = JSON.parse(stored) as number[];
        this.paidStatements = new Set(ids);
      } catch (error) {
        console.error('Error al cargar estados de pago:', error);
        this.paidStatements.clear();
      }
    } else {
      this.paidStatements.clear();
    }
  }

  private savePaidStatements(): void {
    if (!this.selectedMonth) return;

    const storageKey = this.getStorageKey();
    const ids = Array.from(this.paidStatements);
    localStorage.setItem(storageKey, JSON.stringify(ids));
  }

  isPaid(statementId: number): boolean {
    return this.paidStatements.has(statementId);
  }

  togglePayment(statement: AccountStatement, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const isCurrentlyPaid = this.isPaid(statement.id);
    
    if (isCurrentlyPaid) {
      this.paidStatements.delete(statement.id);
    } else {
      this.paidStatements.add(statement.id);
    }

    this.savePaidStatements();
    
    this.paymentToggled.emit({
      statementId: statement.id,
      isPaid: !isCurrentlyPaid,
      amount: statement.montoAPagar
    });
  }
}
