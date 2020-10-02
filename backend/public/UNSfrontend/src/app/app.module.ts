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
import { AgmCoreModule } from '@agm/core';
import {environment} from "../environments/environment";
import { SensorMapComponent } from './components/sensor-map/sensor-map.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ModalModule } from 'ngx-bootstrap/modal';
import { ReviewDeploymentComponent } from './components/review-deployment/review-deployment.component';
import { ExploreMomentsComponent } from './components/explore-moments/explore-moments.component';
import { DeploymentOverviewComponent } from './components/deployment-overview/deployment-overview.component';
import { DeploymentSensorComponent } from './components/deployment-sensor/deployment-sensor.component';
import { DeploymentGatewayComponent } from './components/deployment-gateway/deployment-gateway.component';
import { DeploymentDataComponent } from './components/deployment-data/deployment-data.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    AppComponent,
    SensorsComponent,
    GatewaysComponent,
    DeploymentsComponent,
    HomeComponent,
    CreateDeploymentComponent,
    EditDeploymentComponent,
    SensorMapComponent,
    ReviewDeploymentComponent,
    ExploreMomentsComponent,
    DeploymentOverviewComponent,
    DeploymentSensorComponent,
    DeploymentGatewayComponent,
    DeploymentDataComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    FormsModule,
    AgmCoreModule.forRoot({apiKey: environment.mapsKey})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
