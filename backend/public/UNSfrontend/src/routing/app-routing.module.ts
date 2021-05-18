import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {componentFactoryName} from "@angular/compiler";
import {HomeComponent} from "../app/components/home/home.component";
import {DeploymentsComponent} from "../app/components/deployments/deployments.component";
import {SensorsComponent} from "../app/components/sensors/sensors.component";
import {GatewaysComponent} from "../app/components/gateways/gateways.component";


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'deployments',
        component: DeploymentsComponent
      },
      {
        path: 'sensors',
        component: SensorsComponent
      },
      {
        path: 'gateways',
        component: GatewaysComponent
      }
    ]
  },
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
