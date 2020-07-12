import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Deployment} from "../../models/deployment";
import {Sensor} from "../../models/sensor";
import {Gateway} from "../../models/gateway";
import {SensorService} from "../../services/sensor.service";
import {DeploymentService} from "../../services/deployment.service";
import {GatewayService} from "../../services/gateway.service";


@Component({
  selector: 'app-review-deployment',
  templateUrl: './review-deployment.component.html',
  styleUrls: ['./review-deployment.component.css']
})
export class ReviewDeploymentComponent implements OnInit {

  constructor(private deploymentService: DeploymentService,
              private sensorService: SensorService,
              private gatewayService: GatewayService,
              private activatedRoute: ActivatedRoute) { }


  public deployment: Deployment;
  public sensors: {sensor: Sensor, alpha:number}[];
  public gateways: Gateway[];
  private id:string;
  public mapType = "hybrid";

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.getDeployment();
  }

  private getDeployment(){
    this.deploymentService.getOneDeployment(this.id).then((res) => {
      this.deployment = res;
      console.log(res);
      this.getSensors();
      this.getGateways();
    });
  }

  private getSensors(){
    this.sensors = [];
    for(let sen of this.deployment.sensors){
      this.sensorService.getOneSensor(sen.sensor_id).then((res) => {
        this.sensors.push({sensor: res, alpha:0.4});
        console.log(res);
      });
    }

  }

  private getGateways(){
    this.gateways = [];
    for(let gw of this.deployment.gateways){
      this.gatewayService.getOneGateway(gw.sensor_id).then((res) => {
        this.gateways.push(res[0]);
      });
    }
  }


  public showLocation(id: string) {
    console.log(this.sensors);
    for (let sn of this.sensors) {
        sn.alpha = 0.4;
      if (sn.sensor._id == id) {
        sn.alpha = 1;
      }
    }
  }


}
