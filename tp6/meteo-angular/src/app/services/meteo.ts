import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MeteoService {
  private apiKey = '0ada432b59deb9716c357092c5f79be6';

  constructor() {}

  getMeteo(name: string): Promise<any> {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      name
    )}&units=metric&lang=fr&appid=${this.apiKey}`;

    return fetch(url)
      .then((response) => response.json())
      .then((json) => {
        if (json.cod == 200) {
          return Promise.resolve(json);
        } else {
          return Promise.reject(
            `Météo introuvable pour ${name} (${json.message})`
          );
        }
      });
  }

  getForecast(name: string): Promise<any> {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      name
    )}&units=metric&lang=fr&appid=${this.apiKey}`;

    return fetch(url)
      .then((response) => response.json())
      .then((json) => {
        if (json.cod == '200') {
          return Promise.resolve(json);
        } else {
          return Promise.reject(
            `Prévisions introuvables pour ${name} (${json.message})`
          );
        }
      });
  }
}