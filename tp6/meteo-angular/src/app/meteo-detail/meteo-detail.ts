import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MeteoService } from '../services/meteo';

@Component({
  selector: 'app-meteo-detail',
  templateUrl: './meteo-detail.html',
  standalone: false,
  styleUrl: './meteo-detail.css',
})
export class MeteoDetail implements OnInit {
  meteo: any;
  forecastList: any[] = [];
  errorMessage: string = '';
  latlon: string = '';
  mapUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private meteoService: MeteoService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getMeteo();
  }

  getMeteo(): void {
    const name = this.route.snapshot.paramMap.get('name');

    if (name) {
      this.meteoService
        .getMeteo(name)
        .then((response) => {
          this.meteo = response;
          this.errorMessage = '';
          this.latlon = `${this.meteo.coord.lat},${this.meteo.coord.lon}`;
          this.buildMapUrl(this.meteo.coord.lat, this.meteo.coord.lon);
          this.cdr.detectChanges();
        })
        .catch((fail) => {
          this.meteo = null;
          this.errorMessage = fail;
          this.cdr.detectChanges();
        });

      this.meteoService
        .getForecast(name)
        .then((response) => {
          this.forecastList = response.list.filter((item: any) =>
            item.dt_txt.includes('12:00:00')
          );
          this.cdr.detectChanges();
        })
        .catch((err) => {
          console.error(err);
          this.cdr.detectChanges();
        });
    }
  }

  buildMapUrl(lat: number, lon: number): void {
    const zoom = 8;
    const delta = 0.05 / Math.pow(2, zoom - 10);
    const bbox = `${lon - delta}%2C${lat - delta}%2C${lon + delta}%2C${lat + delta}`;
    const rawUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }
}