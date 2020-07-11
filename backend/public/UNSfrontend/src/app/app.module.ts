import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SensorsComponent } from './components/sensors/sensors.component';
import { GatewaysComponent } from './components/gateways/gateways.component';
import { DeploymentsComponent } from './components/deployments/deployments.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    SensorsComponent,
    GatewaysComponent,
    DeploymentsComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
