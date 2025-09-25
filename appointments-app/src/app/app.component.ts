import { Component, inject } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { ActionsComponent } from './components/actions/actions.component';
import { ReservationsComponent } from './components/reservations/reservations.component';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    ActionsComponent,
    ReservationsComponent,
    BottomNavComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  themeService = inject(ThemeService);
}
