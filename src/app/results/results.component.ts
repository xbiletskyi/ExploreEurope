import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FlightService } from '../flight.service';
import { Trip, Flight } from '../trip.model';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  trips: Trip[] = [];
  sortOrder: { key: string, direction: number }[] = [];

  constructor(private flightService: FlightService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.trips = this.flightService.getTrips();
    if (isPlatformBrowser(this.platformId)) {
      this.populateTable();
    }
  }

  onHeaderClick(key: string) {
    const existingSort = this.sortOrder.find(order => order.key === key);
    if (existingSort) {
      existingSort.direction = -existingSort.direction;
    } else {
      this.sortOrder.push({ key, direction: 1 });
    }
    this.populateTable();
  }

  populateTable(): void {
    const tableBody = document.querySelector('#tripTable tbody');
    if (!tableBody) {
      console.error('Trip table not found!');
      return;
    }

    this.trips.sort((a, b) => this.compareTrips(a, b));

    tableBody.innerHTML = '';  // Clear any existing rows
    this.trips.forEach((trip) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${trip.totalPrice}</td>
        <td>${trip.totalFlights}</td>
        <td>${trip.uniqueCities}</td>
        <td>${trip.uniqueCountries}</td>
        <td>${new Date(trip.departureAt).toLocaleDateString()}</td>
        <td>${new Date(trip.arrivalAt).toLocaleDateString()}</td>
        <td>${this.formatTripSchedule(trip.tripSchedule)}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  compareTrips(a: Trip, b: Trip): number {
    for (const order of this.sortOrder) {
      let comparison = 0;
      if (order.key === 'totalPrice') {
        comparison = a.totalPrice - b.totalPrice;
      } else if (order.key === 'totalFlights') {
        comparison = a.totalFlights - b.totalFlights;
      } else if (order.key === 'uniqueCities') {
        comparison = a.uniqueCities - b.uniqueCities;
      } else if (order.key === 'uniqueCountries') {
        comparison = a.uniqueCountries - b.uniqueCountries;
      } else if (order.key === 'departureAt') {
        comparison = new Date(a.departureAt).getTime() - new Date(b.departureAt).getTime();
      } else if (order.key === 'arrivalAt') {
        comparison = new Date(a.arrivalAt).getTime() - new Date(b.arrivalAt).getTime();
      }

      if (comparison !== 0) {
        return comparison * order.direction;
      }
    }
    return 0;
  }

  formatTripSchedule(schedule: Flight[]): string {
    return schedule.map(flight => `
      ${flight.flightNumber} from ${flight.originAirportName} (${flight.originAirportCode}) to ${flight.destinationAirportName} (${flight.destinationAirportCode}) on ${new Date(flight.departureAt).toLocaleString()}
    `).join('<br>');
  }
}
