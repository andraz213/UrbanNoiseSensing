import {Component, OnInit} from '@angular/core';
import {Gateway} from "../../models/gateway";
import {GatewayService} from "../../services/gateway.service";
import {Deployment} from "../../models/deployment";
import {DeploymentService} from "../../services/deployment.service";

@Component({
  selector: 'app-gateways',
  templateUrl: './gateways.component.html',
  styleUrls: ['./gateways.component.css']
})
export class GatewaysComponent implements OnInit {

  constructor(
    private gatewayService: GatewayService,
    private deploymentService: DeploymentService
  ) {
  }

  public gateways: Gateway[];
  public deployments: Deployment[];

  ngOnInit() {
    console.log("hej");
    this.getGateways();

  }

  private getGateways() {
    this.gatewayService.getGateways().then(result => {
      console.log(result);
      this.gateways = result;
      this.getDeployments();
    });

  }

  private getDeployments() {
    this.deploymentService.getDeployments().then(result => {
      for (let dep of result) {
        for (let gw of this.gateways) {
          if (gw.current_deployment != null) {
            if (gw.current_deployment == dep._id) {
              // @ts-ignore
              gw.deployment_name = dep.name;
            }
          }
        }
      }
      console.log(this.gateways);
    });
  }
}
