import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule , HttpHeaders } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SensorsComponent } from './components/sensors/sensors.component';
import { GatewaysComponent } from './components/gateways/gateways.component';
import { DeploymentsComponent } from './components/deployments/deployments.component';
import { HomeComponent } from './components/home/home.component';
import { CreateDeploymentComponent } from './components/create-deployment/create-deployment.component';
import {FormsModule} from "@angular/forms";
import { EditDeploymentComponent } from './components/edit-deployment/edit-deployment.component';

@NgModule({
  declarations: [
    AppComponent,
    SensorsComponent,
    GatewaysComponent,
    DeploymentsComponent,
    HomeComponent,
    CreateDeploymentComponent,
    EditDeploymentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
