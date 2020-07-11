import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { DeploymentService} from "../../services/deployment.service";
import {Deployment} from "../../models/deployment";

@Component({
  selector: 'app-edit-deployment',
  templateUrl: './edit-deployment.component.html',
  styleUrls: ['./edit-deployment.component.css']
})
export class EditDeploymentComponent implements OnInit {
  public deployment: Deployment;
  private id:string;
  constructor(private activatedRoute: ActivatedRoute, private deploymentService: DeploymentService) { }

  public depDTO: Deployment;

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    console.log(this.id);
    this.getDeployment();
  }

  private getDeployment(){
    this.deploymentService.getOneDeployment(this.id).then(result => {
      this.deployment = result;
      this.depDTO = result;
      console.log(this.deployment);
    })

  }
  public discardChanges(){
    this.getDeployment();
  }

  public saveChangesForm(){
    this.deploymentService.updateDeployment(this.deployment._id, this.depDTO).then(res => {
      console.log(res);
      this.getDeployment();
    });

  }
}
