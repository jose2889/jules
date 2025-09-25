import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerClock } from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss'],
  standalone: true,
  imports: [NgIcon],
  viewProviders: [provideIcons({ tablerClock })],
})
export class ReservationsComponent {
  reservationsByDate = [
    {
      date: 'Martes, 23 sept',
      reservations: [
        {
          name: 'Sofia Contreras',
          service: 'Corte de cabello',
          time: '10:15 am - 10:30 am',
          duration: '15 min',
        },
        {
          name: 'Daniel Camacho',
          service: 'Asesoría',
          time: '12:30 pm - 1:30 pm',
          duration: '60 min',
        },
      ],
    },
    {
      date: 'Jueves, 25 sept',
      reservations: [
        {
          name: 'Sofia Contreras',
          service: 'Corte de cabello',
          time: '10:15 am - 10:30 am',
          duration: '15 min',
        },
        {
          name: 'Daniel Camacho',
          service: 'Asesoría',
          time: '10:30 am - 11:30 am',
          duration: '60 min',
        },
      ],
    },
  ];

  getTotalReservations() {
    return this.reservationsByDate.reduce(
      (total, group) => total + group.reservations.length,
      0
    );
  }
}