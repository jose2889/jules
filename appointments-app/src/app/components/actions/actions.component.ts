import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  tablerLayoutGridPlus,
  tablerClockPlus,
  tablerShare,
  tablerUsers,
} from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
  standalone: true,
  imports: [NgIcon],
  viewProviders: [
    provideIcons({
      tablerLayoutGridPlus,
      tablerClockPlus,
      tablerShare,
      tablerUsers,
    }),
  ],
})
export class ActionsComponent {
  actions = [
    { label: 'Crear', icon: 'tablerLayoutGridPlus', color: 'yellow' },
    { label: 'Bloquear', icon: 'tablerClockPlus', color: 'green' },
    { label: 'Compartir', icon: 'tablerShare', color: 'pink' },
    { label: 'Clientes', icon: 'tablerUsers', color: 'blue' },
  ];
}