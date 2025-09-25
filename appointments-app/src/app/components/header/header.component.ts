import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [NgIcon, CommonModule],
  providers: [DatePipe],
})
export class HeaderComponent {
  currentDate = new Date();
}