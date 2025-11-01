import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumenNacional, ResumenInternacional } from '../models';
import { CurrencySpacePipe } from '../currency-space.pipe';

@Component({
  selector: 'app-resumen-nacional-internacional',
  standalone: true,
  imports: [CommonModule, CurrencySpacePipe],
  templateUrl: './resumen-nacional-internacional.component.html',
  styleUrl: './resumen-nacional-internacional.component.css'
})
export class ResumenNacionalInternacionalComponent {
  @Input() resumenNacional: ResumenNacional | null = null;
  @Input() resumenInternacional: ResumenInternacional | null = null;
}

