import { Component, OnInit } from '@angular/core';
import { Deployment } from "../../models/deployment";
import { DeploymentService } from "../../services/deployment.service";
import { DeploymentCreationDTO } from "../../classes/deployment-creation-dto"
import { Router } from '@angular/router';

@Component({
  selector: 'app-deployments',
  templateUrl: './deployments.component.html',
  styleUrls: ['./deployments.component.css']
})
export class DeploymentsComponent implements OnInit {

  constructor(private deploymentService: DeploymentService, private router: Router) { }

  public deployments: Deployment[];
  public creating = false;

  public newdep: DeploymentCreationDTO = {name: ''};

  ngOnInit() {
    this.getDeployments();
  }
  private getDeployments(){
    this.deploymentService.getDeployments().then(result => {
      this.deployments = result;
      console.log(result);
    });

  }

  public switchCreating(){
      this.creating = !this.creating;
  }

  public createDeployment(){
    console.log("creating");
    console.log(this.newdep.name);
    this.deploymentService.createDeployment(this.newdep).then(result => {
      console.log(result);
      this.newdep.name = '';
      this.creating = false;
      this.deployments.unshift(result);
    });

  }


}
