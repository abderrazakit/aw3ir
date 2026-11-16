import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Meteo } from './meteo/meteo';
import { MeteoDetail } from './meteo-detail/meteo-detail';

@NgModule({
  declarations: [
    App,
    Meteo,
    MeteoDetail,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    DatePipe,
  ],
  bootstrap: [App],
})
export class AppModule {}