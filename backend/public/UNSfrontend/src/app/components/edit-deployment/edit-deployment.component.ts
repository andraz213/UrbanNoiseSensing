import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DeploymentService} from "../../services/deployment.service";
import {Deployment} from "../../models/deployment";
import {Sensor} from "../../models/sensor";
import {SensorService} from "../../services/sensor.service";
import {Gateway} from "../../models/gateway";
import {GatewayService} from "../../services/gateway.service";
import {DataDeployment} from "../../models/data-deployment";

import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-deployment',
  templateUrl: './edit-deployment.component.html',
  styleUrls: ['./edit-deployment.component.css']
})
export class EditDeploymentComponent implements OnInit {


  constructor(private modalService: BsModalService,
              private activatedRoute: ActivatedRoute,
              private deploymentService: DeploymentService,
              private sensorService: SensorService,
              private gatewayService: GatewayService,
              private router: Router) {
  }

  public errorMessages: string[];
  public depDTO: Deployment;
  public sensors: { sensor: Sensor, chosen: boolean, latitude: number, longitude: number, alpha: number }[];
  public gateways: { gateway: Gateway, chosen: boolean,}[];
  public deployment: Deployment;
  private id: string;
  modalRef: BsModalRef;

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    console.log(this.id);
    this.getDeployment();
    this.getSensors();
    this.getGateways();
  }

  private getSensors() {
    this.sensorService.getSensors().then(result => {
      console.log(result);
      this.sensors = [];
      for (let sn of result) {
        if (!sn.current_deployment || sn.current_deployment == '') {
          this.sensors.push({sensor: sn, chosen: false, latitude: 0, longitude: 0, alpha: 0});
        }
      }
      console.log(this.sensors);
    });
  }

  openModal(not_ok: TemplateRef<any>, ok: TemplateRef<any>) {
    this.errorMessages = [];

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

      this.modalRef = this.modalService.show(ok, {class: 'modal-sm'});
    }

  }

  decline(): void {
    this.modalRef.hide();
  }

  private getGateways() {
    this.gateways = [];
    this.gatewayService.getGateways().then(result => {
      console.log(result);
      this.gateways = [];
      for (let gw of result) {
        if (!gw.current_deployment || gw.current_deployment == '') {
          this.gateways.push({gateway: gw, chosen: false});
        }
      }
      console.log(this.sensors);
    });
  }


  public deployDeployment(done: TemplateRef<any>, error: TemplateRef<any>){
    for(let sn of this.sensors){
      if(sn.chosen == true){
        let data_dep = new DataDeployment();
        data_dep.location = [sn.latitude, sn.longitude];
        data_dep.sensor_id = sn.sensor._id;
        this.deployment.sensors.push(data_dep);
      }
    }

    for(let gw of this.gateways){
      if(gw.chosen == true){
        let data_dep = new DataDeployment();
        data_dep.sensor_id = gw.gateway._id;
        data_dep.location = [0, 0];
        this.deployment.gateways.push(data_dep);
      }
    }

    this.deploymentService.updateDeployment(this.deployment._id, this.deployment).then(res => {
      console.log(res);
      this.getDeployment();
    });

  }



  public addGatewayToDeploy(id:string){
    for(let gw of this.gateways){
      if(gw.gateway._id == id){
        gw.chosen = !gw.chosen;
      }
    }
  }


  private getDeployment() {
    this.deploymentService.getOneDeployment(this.id).then(result => {
      this.deployment = result;
      this.depDTO = result;
      console.log(this.deployment);
      if(this.deployment.status == 'deployed'){
        this.router.navigateByUrl(`reviewdeployment/${this.deployment._id}`);
      }
    })

  }

  public discardChanges() {
    this.getDeployment();
  }

  public saveChangesForm() {
    this.deploymentService.updateDeployment(this.deployment._id, this.depDTO).then(res => {
      console.log(res);
      this.getDeployment();
    });

  }


  public addSensorToDeploy(id: string) {

  }

  public showLocation(id: string) {
    console.log(this.sensors);
    for (let sn of this.sensors) {
      if (sn.chosen) {
        sn.alpha = 0.4;
      }
      if (sn.sensor._id == id) {
        sn.alpha = 1;
      }
    }
  }

  mapType = 'hybrid';
  selectedMarker;
  markers = [];

  addMarker(lat: number, lng: number) {
    for (let sn of this.sensors) {
      if (sn.chosen == false) {
        sn.chosen = true;
        sn.longitude = lng;
        sn.latitude = lat;
        sn.alpha = 0.4;
        return;
      }
    }
    //this.markers.push({ lat, lng, alpha: 0.4 });
  }

  max(coordType: 'lat' | 'lng'): number {
    return Math.max(...this.markers.map(marker => marker[coordType]));
  }

  min(coordType: 'lat' | 'lng'): number {
    return Math.min(...this.markers.map(marker => marker[coordType]));
  }

  removeSensor(event) {
    console.log(event);
    for (let sn of this.sensors) {
      if (sn.longitude == event.longitude && sn.latitude == event.latitude) {
        sn.chosen = false;
        sn.alpha = 0;
        return;
      }
    }
  }

  selectMarker(event) {
    console.log(event);
    for (let sn of this.sensors) {
      if (sn.longitude == event.longitude && sn.latitude == event.latitude && sn.chosen == true) {
        sn.chosen = false;
        sn.alpha = 0;
        return;
      }
    }
  }
}
