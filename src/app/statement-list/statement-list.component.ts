import { Component, Input } from '@angular/core';
import { AccountStatement } from '../models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statement-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statement-list.component.html',
  styleUrl: './statement-list.component.css'
})
export class StatementListComponent {
  @Input() statements: AccountStatement[] = [];
}
