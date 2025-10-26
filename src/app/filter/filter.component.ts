import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  @Output() monthSelected = new EventEmitter<string>();
  selectedMonth: string = '2025-09';

  onMonthChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.selectedMonth = target.value;
      this.monthSelected.emit(this.selectedMonth);
    }
  }
}
