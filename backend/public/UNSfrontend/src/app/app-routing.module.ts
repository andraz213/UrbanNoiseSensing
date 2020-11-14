import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { componentFactoryName } from "@angular/compiler";
import {HomeComponent} from "../app/components/home/home.component";
import {DeploymentsComponent} from "../app/components/deployments/deployments.component";
import {SensorsComponent} from "../app/components/sensors/sensors.component";
import {GatewaysComponent} from "../app/components/gateways/gateways.component";
import {CreateDeploymentComponent} from "./components/create-deployment/create-deployment.component";
import {EditDeploymentComponent} from "./components/edit-deployment/edit-deployment.component";
import {ReviewDeploymentComponent} from "./components/review-deployment/review-deployment.component";
import {FinishedDeploymentComponent} from "./components/finished-deployment/finished-deployment.component";


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
      },
      {
        path: 'createdeployment',
        component: CreateDeploymentComponent
      },
      {
        path: 'editdeployment/:id',
        component: EditDeploymentComponent
      },
      {
        path: 'reviewdeployment/:id',
        component: ReviewDeploymentComponent
      },
      {
        path: 'finisheddeployment/:id',
        component: FinishedDeploymentComponent
      }

    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
