import { Component, OnInit } from '@angular/core';
import { Deployment } from "../../models/deployment";
import { DeploymentService } from "../../services/deployment.service";

@Component({
  selector: 'app-deployments',
  templateUrl: './deployments.component.html',
  styleUrls: ['./deployments.component.css']
})
export class DeploymentsComponent implements OnInit {

  constructor(private deploymentService: DeploymentService) { }

  public deployments: Deployment[];

  ngOnInit() {
    this.getDeployments();
  }
  private getDeployments(){
    this.deploymentService.getDeployments().then(result => {
      this.deployments = result;
      console.log(result);
    });

  }
}
