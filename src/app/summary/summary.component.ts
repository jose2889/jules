import { Component, Input } from '@angular/core';
import { Summary } from '../models';
import { CommonModule } from '@angular/common';
import { CurrencySpacePipe } from '../currency-space.pipe';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, CurrencySpacePipe],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent {
  @Input() summary: Summary | null = null;
}
