export interface Trip {
  totalPrice: number;
  totalFlights: number;
  uniqueCities: number;
  uniqueCountries: number;
  departureAt: string;
  arrivalAt: string;
  tripSchedule: Flight[];
}

export interface Flight {
  flightNumber: string;
  originAirportName: string;
  originAirportCode: string;
  destinationAirportName: string;
  destinationAirportCode: string;
  departureAt: string;
}
interface SearchParams {
  origin: string;
  destination?: string;
  departureAt: string;
  returnBefore?: string;
  budget: number;
  minStay?: number;
  maxStay?: number;
  schengenOnly?: boolean;
  timeLimitSeconds: number;
}
