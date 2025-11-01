import { Component, Input } from '@angular/core';
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
export class StatementListComponent {
  @Input() statements: AccountStatement[] = [];
  @Input() selectedMonth: string = '';

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
}
