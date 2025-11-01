import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumenNacional, ResumenInternacional } from '../models';
import { CurrencySpacePipe } from '../currency-space.pipe';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-resumen-nacional-internacional',
  standalone: true,
  imports: [CommonModule, CurrencySpacePipe, FilterComponent],
  templateUrl: './resumen-nacional-internacional.component.html',
  styleUrl: './resumen-nacional-internacional.component.css'
})
export class ResumenNacionalInternacionalComponent {
  @Input() resumenNacional: ResumenNacional | null = null;
  @Input() resumenInternacional: ResumenInternacional | null = null;
  @Input() selectedMonth: string = '';
  @Output() monthSelected = new EventEmitter<string>();
}

