import { Component, EventEmitter, Output, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnInit, OnChanges {
  @Input() selectedMonth: string = '';
  @Output() monthSelected = new EventEmitter<string>();

  ngOnInit() {
    // Si no hay mes seleccionado, usar el mes actual
    if (!this.selectedMonth) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      this.selectedMonth = `${year}-${month}`;
      
      // Emitir el mes actual por defecto solo si no hay Input
      this.monthSelected.emit(this.selectedMonth);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedMonth'] && changes['selectedMonth'].currentValue) {
      this.selectedMonth = changes['selectedMonth'].currentValue;
    }
  }

  onMonthChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.selectedMonth = target.value;
      this.monthSelected.emit(this.selectedMonth);
    }
  }
}
