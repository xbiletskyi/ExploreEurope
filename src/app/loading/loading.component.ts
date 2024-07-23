import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FlightService } from '../flight.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  loadingBar!: HTMLElement;

  constructor(
    private router: Router,
    private flightService: FlightService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const loadingBarElement = document.getElementById('loadingBar');
      if (loadingBarElement && loadingBarElement.firstElementChild) {
        this.loadingBar = loadingBarElement.firstElementChild as HTMLElement;
        this.animateLoadingBar();

        const params = this.flightService.getSearchParams();
        const duration = parseInt(params.timeLimitSeconds, 10) * 1000;

        // Start fetching trips immediately and handle the navigation on completion
        this.flightService.fetchTrips(params).then(trips => {
          this.flightService.setTrips(trips);
          this.router.navigate(['/results']);
        }).catch(error => console.error('Error fetching data: ', error));
      } else {
        console.error('Loading bar element not found');
      }
    }
  }

  animateLoadingBar(): void {
    let startTime: number | null = null;
    const duration = this.flightService.getSearchParams().timeLimitSeconds * 1000;

    const frame = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      this.loadingBar.style.width = progress + '%';
      if (progress < 100) {
        requestAnimationFrame(frame);
      }
    };

    if (isPlatformBrowser(this.platformId)) {
      requestAnimationFrame(frame);
    }
  }
}
