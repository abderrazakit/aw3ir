import { Component, OnInit } from '@angular/core';
import { MeteoItem } from '../meteoItem';

@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.html',
  standalone: false,
  styleUrl: './meteo.css',
})
export class Meteo implements OnInit {
  city: MeteoItem = {
    name: '',
    id: 0,
    weather: null,
  };

  cityList: MeteoItem[] = [];
  errorMessage: string = '';

  constructor() {}

  ngOnInit() {
    const storedList = localStorage.getItem('cityList');
    if (storedList !== undefined && storedList !== null) {
      this.cityList = JSON.parse(storedList);
    } else {
      this.cityList = [];
    }
  }

  onSubmit() {
    const trimmedName = this.city.name?.trim();
    if (trimmedName && !this.isCityExist(trimmedName)) {
      const currentCity = new MeteoItem();
      currentCity.name = trimmedName;
      this.cityList.push(currentCity);

      this.saveCityList();
      this.errorMessage = '';
      this.city.name = '';
    } else if (trimmedName) {
      this.errorMessage = `La ville "${trimmedName}" existe déjà dans la liste.`;
    }
  }

  remove(_city: MeteoItem) {
    this.cityList = this.cityList.filter(
      (item: MeteoItem) => item.name !== _city.name
    );
    this.saveCityList();
  }

  isCityExist(_cityName: string): boolean {
    return (
      this.cityList.filter(
        (item: MeteoItem) =>
          item.name?.trim().toUpperCase() === _cityName.trim().toUpperCase()
      ).length > 0
    );
  }

  saveCityList() {
    localStorage.setItem('cityList', JSON.stringify(this.cityList));
  }
}