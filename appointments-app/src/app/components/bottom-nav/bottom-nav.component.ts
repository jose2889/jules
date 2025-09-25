import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  tablerHome,
  tablerCalendar,
  tablerPlus,
  tablerBell,
  tablerUser,
} from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
  standalone: true,
  imports: [NgIcon],
  viewProviders: [
    provideIcons({
      tablerHome,
      tablerCalendar,
      tablerPlus,
      tablerBell,
      tablerUser,
    }),
  ],
})
export class BottomNavComponent {
  navItems = [
    { label: 'Inicio', icon: 'tablerHome', active: true },
    { label: 'Agenda', icon: 'tablerCalendar' },
    { label: 'Notificaciones', icon: 'tablerBell' },
    { label: 'Perfil', icon: 'tablerUser' },
  ];
}