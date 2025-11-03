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
  @Output() paymentToggled = new EventEmitter<{ statementId: number; isPaid: boolean; amount: number; isNacional: boolean }>();
  @Output() monthSelected = new EventEmitter<string>();
  
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
      amount: statement.montoAPagar,
      isNacional: statement.divisa === 'CLP' || statement.divisa === 'clp'
    });
  }

  goToPreviousMonth(): void {
    if (!this.selectedMonth) return;
    
    const [year, month] = this.selectedMonth.split('-');
    const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    date.setMonth(date.getMonth() - 1);
    
    const newYear = date.getFullYear();
    const newMonth = String(date.getMonth() + 1).padStart(2, '0');
    const newMonthString = `${newYear}-${newMonth}`;
    
    this.monthSelected.emit(newMonthString);
  }

  goToNextMonth(): void {
    if (!this.selectedMonth) return;
    
    const [year, month] = this.selectedMonth.split('-');
    const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    date.setMonth(date.getMonth() + 1);
    
    const newYear = date.getFullYear();
    const newMonth = String(date.getMonth() + 1).padStart(2, '0');
    const newMonthString = `${newYear}-${newMonth}`;
    
    this.monthSelected.emit(newMonthString);
  }

  getImageUrl(url: string): string {
    if (!url || !url.trim()) {
      return '';
    }
    
    const trimmedUrl = url.trim();
    
    // Si ya es una URL completa, retornarla tal cual
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://') || trimmedUrl.startsWith('data:')) {
      return trimmedUrl;
    }
    
    // Si es una ruta relativa que empieza con /, podría necesitar un base URL
    // Por ahora retornamos la URL tal cual
    return trimmedUrl;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img) return;
    
    const originalSrc = img.getAttribute('data-original-src') || img.src;
    const bancoName = img.alt.replace(' logo', '') || 'B';
    
    // Si ya reintentamos, mostrar fallback directamente
    if (img.dataset['retryCount'] === 'true') {
      this.showImageFallback(img, bancoName);
      return;
    }
    
    // Primera vez que falla - intentar cargar directamente
    img.dataset['retryCount'] = 'true';
    
    // Reintentar una vez con la URL original
    const retryImg = new Image();
    retryImg.onload = () => {
      img.src = originalSrc;
    };
    retryImg.onerror = () => {
      this.showImageFallback(img, bancoName);
    };
    retryImg.src = originalSrc;
  }

  private showImageFallback(img: HTMLImageElement, bancoName: string): void {
    const firstLetter = bancoName.charAt(0).toUpperCase();
    const svgData = `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <rect width="32" height="32" fill="#e5e7eb" rx="4"/>
        <text x="16" y="16" dominant-baseline="central" text-anchor="middle" font-size="14" font-weight="600" fill="#6b7280">${firstLetter}</text>
      </svg>
    `)}`;
    img.src = svgData;
    img.onerror = null; // Prevenir loops infinitos
  }
}
