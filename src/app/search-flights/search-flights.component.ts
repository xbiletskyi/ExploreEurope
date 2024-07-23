import { Component, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightService } from '../flight.service';
import { CommonModule, isPlatformBrowser } from "@angular/common";

@Component({
  selector: 'app-search-flights',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './search-flights.component.html',
  styleUrls: ['./search-flights.component.scss']
})
export class SearchFlightsComponent implements OnInit {
  flightDetails = {
    origin: '',
    destination: '',
    departureAt: '',
    returnBefore: '',
    budget: 100,
    minStay: 1,
    maxStay: 1,
    schengenOnly: false,
    timeLimitSeconds: 10
  };

  allValid = false;

  constructor(
    private router: Router,
    private flightService: FlightService,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.validateForm();
  }

  validateForm() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    let valid = true;

    // Validate origin
    if (/^[A-Z]{3}$/.test(this.flightDetails.origin)) {
      this.setValid('origin');
    } else {
      this.setInvalid('origin');
      valid = false;
    }

    // Validate departure date
    const currentDate = new Date().toISOString().split('T')[0];
    if (this.flightDetails.departureAt > currentDate && (!this.flightDetails.returnBefore || this.flightDetails.departureAt < this.flightDetails.returnBefore)) {
      this.setValid('departureAt');
    } else {
      this.setInvalid('departureAt');
      valid = false;
    }

    // Validate budget
    if (this.flightDetails.budget !== null && this.flightDetails.budget >= 100) {
      this.setValid('budget');
    } else {
      this.setInvalid('budget');
      valid = false;
    }

    this.allValid = valid;
  }

  setValid(field: string) {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(field);
      if (element) {
        this.renderer.addClass(element, 'valid');
        this.renderer.removeClass(element, 'invalid');
      }
    }
  }

  setInvalid(field: string) {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(field);
      if (element) {
        this.renderer.addClass(element, 'invalid');
        this.renderer.removeClass(element, 'valid');
      }
    }
  }

  onSearch() {
    this.validateForm();
    if (!this.allValid) {
      return;
    }
    this.flightService.setSearchParams(this.flightDetails);
    this.router.navigate(['/loading']);
  }
}
