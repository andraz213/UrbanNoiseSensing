import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { DeploymentService} from "../../services/deployment.service";
import {Deployment} from "../../models/deployment";
import {Sensor} from "../../models/sensor";
import {SensorService} from "../../services/sensor.service";

@Component({
  selector: 'app-edit-deployment',
  templateUrl: './edit-deployment.component.html',
  styleUrls: ['./edit-deployment.component.css']
})
export class EditDeploymentComponent implements OnInit {
  public deployment: Deployment;
  private id:string;
  constructor(private activatedRoute: ActivatedRoute, private deploymentService: DeploymentService, private sensorService: SensorService) { }

  public depDTO: Deployment;
  public sensors: {sensor: Sensor, chosen: boolean, latitude: number, longitude: number, alpha:number}[];

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    console.log(this.id);
    this.getDeployment();
    this.getSensors();
  }

  private getSensors() {
    this.sensorService.getSensors().then(result => {
      console.log(result);
      this.sensors = [];
      for(let sn of result){
        if(!sn.current_deployment || sn.current_deployment == ''){
          this.sensors.push({sensor:sn, chosen:false, latitude:0, longitude:0, alpha:0});
        }
      }
      console.log(this.sensors);
    });
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



  public addSensorToDeploy(id:string){

  }

  public showLocation(id:string){
    console.log(this.sensors);
    for(let sn of this.sensors){
      if(sn.chosen){
        sn.alpha = 0.4;
      }
      if(sn.sensor._id == id){
        sn.alpha = 1;
      }
    }
  }

  mapType = 'hybrid';
  selectedMarker;
  markers = [

  ];

  addMarker(lat: number, lng: number) {
    for(let sn of this.sensors){
      if(sn.chosen == false){
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

  removeSensor(event){
    console.log(event);
    for(let sn of this.sensors){
      if(sn.longitude == event.longitude && sn.latitude == event.latitude){
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
