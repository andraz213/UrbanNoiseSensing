import { Component, OnInit } from '@angular/core';
import {Deployment} from "../../models/deployment";
import {DeploymentService} from "../../services/deployment.service";
import {SensorService} from "../../services/sensor.service";
import {GatewayService} from "../../services/gateway.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-finished-deployment',
  templateUrl: './finished-deployment.component.html',
  styleUrls: ['./finished-deployment.component.css']
})
export class FinishedDeploymentComponent implements OnInit {

  constructor(private deploymentService: DeploymentService,
              private sensorService: SensorService,
              private gatewayService: GatewayService,
              private activatedRoute: ActivatedRoute) { }

  public deployment: Deployment;
  public id:string;

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.getDeployment();
  }

  private getDeployment(){
    this.deploymentService.getOneDeployment(this.id).then((res) => {
      this.deployment = res;
      console.log(res);

    });
  }

}
