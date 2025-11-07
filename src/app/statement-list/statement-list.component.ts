import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AccountStatement } from '../models';
import { CommonModule } from '@angular/common';
import { CurrencySpacePipe } from '../currency-space.pipe';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-statement-list',
  standalone: true,
  imports: [CommonModule, CurrencySpacePipe],
  templateUrl: './statement-list.component.html',
  styleUrl: './statement-list.component.css'
})
export class StatementListComponent {
  @Input() statements: AccountStatement[] = [];
  @Input() selectedMonth: string = '';
  @Output() paymentToggled = new EventEmitter<{ statementId: number; isPaid: boolean; amount: number; isNacional: boolean }>();
  @Output() monthSelected = new EventEmitter<string>();

  errorMessage: string | null = null;
  showError: boolean = false;

  constructor(private apiService: ApiService) {}

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

  isPaid(statement: AccountStatement): boolean {
    return statement.pagado === true;
  }

  togglePayment(statement: AccountStatement, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    // Ocultar errores previos
    this.hideError();
    
    // Llamar al servicio para actualizar el estado
    this.apiService.updatePaymentStatus(statement.id).subscribe({
      next: (response) => {
        if (response.success) {
          // Actualizar el estado local del statement
          statement.pagado = response.paid;
          
          // Emitir el evento para notificar al componente padre
          this.paymentToggled.emit({
            statementId: statement.id,
            isPaid: response.paid,
            amount: statement.montoAPagar,
            isNacional: statement.divisa === 'CLP' || statement.divisa === 'clp'
          });
        } else {
          this.showErrorMessage('La actualización no fue exitosa. Por favor, intente nuevamente.');
        }
      },
      error: (error) => {
        console.error('Error al actualizar el estado de pago:', error);
        let errorMsg = 'Error al actualizar el estado de pago.';
        
        if (error.status === 500) {
          errorMsg = 'Error del servidor (500). Por favor, contacte al administrador o intente más tarde.';
        } else if (error.status === 404) {
          errorMsg = 'El recurso solicitado no fue encontrado.';
        } else if (error.status === 400) {
          errorMsg = 'Solicitud inválida. Por favor, verifique los datos.';
        } else if (error.status === 0) {
          errorMsg = 'Error de conexión. Verifique su conexión a internet.';
        } else if (error.error?.message) {
          errorMsg = error.error.message;
        } else if (error.message) {
          errorMsg = error.message;
        }
        
        this.showErrorMessage(errorMsg);
      }
    });
  }

  showErrorMessage(message: string): void {
    this.errorMessage = message;
    this.showError = true;
    
    // Ocultar automáticamente después de 5 segundos
    setTimeout(() => {
      this.hideError();
    }, 5000);
  }

  hideError(): void {
    this.showError = false;
    this.errorMessage = null;
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
