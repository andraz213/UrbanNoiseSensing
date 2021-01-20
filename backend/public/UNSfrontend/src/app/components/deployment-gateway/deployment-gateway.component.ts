import {Component, Input, OnInit} from '@angular/core';
import {Gateway} from "../../models/gateway";
import {DeploymentService} from "../../services/deployment.service";
import {SensorService} from "../../services/sensor.service";
import {GatewayService} from "../../services/gateway.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BsModalService} from "ngx-bootstrap/modal";
import {Deployment} from "../../models/deployment";
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';



@Component({
  selector: 'app-deployment-gateway',
  templateUrl: './deployment-gateway.component.html',
  styleUrls: ['./deployment-gateway.component.css']
})
export class DeploymentGatewayComponent implements OnInit {

  constructor(private deploymentService: DeploymentService,
              private sensorService: SensorService,
              private gatewayService: GatewayService,
              private activatedRoute: ActivatedRoute,
              private modalService: BsModalService,
              private router: Router) { }

  @Input() id: string;
  @Input() deployment: Deployment;

  private gateways_cp: Gateway[];
  public gateways: Gateway[];

  ngOnInit() {


    this.getGateways();

    const secondsCounter = interval(1000);
    const subscription = secondsCounter.subscribe(n =>
      this.updateGateways());

  }


  private getGateways(){
    let temp_gateways = [];
    for(let gw of this.deployment.gateways){
      this.gatewayService.getOneGateway(gw.sensor_id).then((res) => {
        temp_gateways.push(res);
        console.log(res);
      });
    }
    this.gateways = temp_gateways;
  }

  private updateGateways(){

    for(let gw of this.gateways){
      this.gatewayService.getOneGateway(gw._id).then((res) => {
        gw.telemetry = res.telemetry;

      });
    }
  }


}
