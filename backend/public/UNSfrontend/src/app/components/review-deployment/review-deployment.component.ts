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
  public sensors: {sensor: Sensor, alpha:number, measurements:number}[];
  public gateways: Gateway[];
  private id:string;
  public mapType = "hybrid";
  public longitude = 0;
  public latitude = 0;
  modalRef: BsModalRef;


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


  private findnumber(id: String){
    for(let sn of this.deployment.number_agregate){
      if(sn.sensor == id){
        return(sn.num);
      }

    }
    return 0;

  }


  private getSensors(){
    this.sensors = [];
    for(let sen of this.deployment.sensors) {

        this.sensorService.getOneSensor(sen.sensor_id).then((reses) => {
          let res = reses[0];
            this.sensors.push({sensor: res, alpha: 0.4, measurements: this.findnumber(sen.sensor_id)});
          this.longitude += res.current_location[0] / this.deployment.sensors.length;
          // @ts-ignore
          this.latitude += res.current_location[1] / this.deployment.sensors.length;
          console.log(res);
        });
      }

  }

  private getGateways(){
    this.gateways = [];
    for(let gw of this.deployment.gateways){
      this.gatewayService.getOneGateway(gw.sensor_id).then((res) => {
        this.gateways.push(res);
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


  public openModal(confirm: TemplateRef<any>) {
   /* this.errorMessages = [];

    let gw_num = 0;
    for(let gw of this.gateways){
      if(gw.chosen == true){
        gw_num++;
      }
    }
    if(gw_num < 1){
      this.errorMessages.push("You don't have any gateways selected!");
    }

    let sn_num = 0;
    for(let sn of this.sensors){
      if(sn.chosen == true){
        sn_num++;
      }
    }
    if(sn_num < 1){
      this.errorMessages.push("Place at least one sensor!");
    }

    if(!this.deployment.name || this.deployment.name == ''){
      this.errorMessages.push("Save the name of this deployment!");
    }

    if(this.deployment.status != 'pending'){
      this.errorMessages.push("Something went wrong with your deployment. Is it already deployed?");
    }

    if(this.errorMessages.length != 0) {
      this.modalRef = this.modalService.show(not_ok, {class: 'modal-sm'});
    } else {
      this.modalRef = this.modalService.show(confirm, {class: 'modal-sm'});

    }*/

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

      //this.errorMessages.push(res.message);
    });



  }

  public navigateBack(){
    this.router.navigateByUrl(`deployments`);
  }




}


