import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Deployment} from "../../models/deployment";
import {Sensor} from "../../models/sensor";
import {Gateway} from "../../models/gateway";
import {SensorService} from "../../services/sensor.service";
import {DeploymentService} from "../../services/deployment.service";
import {GatewayService} from "../../services/gateway.service";

import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-review-deployment',
  templateUrl: './review-deployment.component.html',
  styleUrls: ['./review-deployment.component.css']
})
export class ReviewDeploymentComponent implements OnInit {

  constructor(private deploymentService: DeploymentService,
              private sensorService: SensorService,
              private gatewayService: GatewayService,
              private activatedRoute: ActivatedRoute,
              private modalService: BsModalService,
              private router: Router) { }


  public deployment: Deployment;
  private id:string;
  modalRef: BsModalRef;

  public openTab = "overview";


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


  public openModal(confirm: TemplateRef<any>) {

    this.modalRef = this.modalService.show(confirm, {class: 'modal-sm'});

  }

  decline(): void {
    this.modalRef.hide();
  }


  public finishDeployment(){
    this.deploymentService.finishDeployment(this.deployment._id).then((data) =>{
      console.log(data);
      this.modalRef.hide();
      this.navigateBack();
    });

  }

  public navigateBack(){
    this.router.navigateByUrl(`deployments`);
  }


  public switchTab(name: string){
    this.openTab = name;
  }


}


