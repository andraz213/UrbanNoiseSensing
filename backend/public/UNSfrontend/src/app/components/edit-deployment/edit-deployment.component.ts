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

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    console.log(this.id);
    this.getDeployment();
  }

  private getDeployment(){
    this.deploymentService.getOneDeployment(this.id).then(result => {
      this.deployment = result;
      console.log(this.deployment);
    })

  }

}
