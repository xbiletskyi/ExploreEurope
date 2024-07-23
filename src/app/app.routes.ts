import { Routes } from '@angular/router';
import { SearchFlightsComponent } from './search-flights/search-flights.component';
import { LoadingComponent } from './loading/loading.component';
import { ResultsComponent } from './results/results.component';

export const routes: Routes = [
  { path: '', component: SearchFlightsComponent },
  { path: 'loading', component: LoadingComponent },
  { path: 'results', component: ResultsComponent }
];
