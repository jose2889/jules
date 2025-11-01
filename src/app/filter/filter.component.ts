import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnInit {
  @Output() monthSelected = new EventEmitter<string>();
  selectedMonth: string = '';

  ngOnInit() {
    // Obtener el mes y año actual en formato YYYY-MM
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth() retorna 0-11, necesitamos 1-12
    this.selectedMonth = `${year}-${month}`;
    
    // Emitir el mes actual por defecto
    this.monthSelected.emit(this.selectedMonth);
  }

  onMonthChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.selectedMonth = target.value;
      this.monthSelected.emit(this.selectedMonth);
    }
  }
}
