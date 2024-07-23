import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import { Trip } from './trip.model';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private searchParams: any = {};
  private trips: any[] = [];

  constructor(private http: HttpClient) {}

  setSearchParams(params: any): void {
    this.searchParams = params;
  }

  getSearchParams(): any {
    return this.searchParams;
  }

  setTrips(trips: any[]) {
    this.trips = trips;
  }

  getTrips(): any[] {
    return this.trips;
  }

  fetchTrips(params: any): Promise<Trip[]> {
    let url = `http://localhost:60001/v1/trips?origin=${params.origin}&departureAt=${params.departureAt}&budget=${params.budget}`;

    if (params.destination) {
      url += `&destination=${params.destination}`;
    }
    if (params.returnBefore) {
      url += `&returnBefore=${params.returnBefore}`;
    }
    if (params.minStay) {
      url += `&minStay=${params.minStay}`;
    }
    if (params.maxStay) {
      url += `&maxStay=${params.maxStay}`;
    }
    if (params.schengenOnly) {
      url += `&schengenOnly=${params.schengenOnly}`;
    }
    if (params.timeLimitSeconds) {
      url += `&timeLimitSeconds=${params.timeLimitSeconds}`;
    }

    return firstValueFrom(this.http.get<Trip[]>(url));
  }
}
