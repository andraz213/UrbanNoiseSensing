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



  lat = 43.879078;
  lng = -103.4615581;
  selectedMarker;
  markers = [
    // These are all just random coordinates from https://www.random.org/geographic-coordinates/
    { lat: 22.33159, lng: 105.63233, alpha: 1 },
    { lat: 7.92658, lng: -12.05228, alpha: 1 },
    { lat: 48.75606, lng: -118.859, alpha: 1 },
    { lat: 5.19334, lng: -67.03352, alpha: 1 },
    { lat: 12.09407, lng: 26.31618, alpha: 1 },
    { lat: 47.92393, lng: 78.58339, alpha: 1 }
  ];

  addMarker(lat: number, lng: number) {
    this.markers.push({ lat, lng, alpha: 0.4 });
  }

  max(coordType: 'lat' | 'lng'): number {
    return Math.max(...this.markers.map(marker => marker[coordType]));
  }

  min(coordType: 'lat' | 'lng'): number {
    return Math.min(...this.markers.map(marker => marker[coordType]));
  }

  selectMarker(event) {
    this.selectedMarker = {
      lat: event.latitude,
      lng: event.longitude
    };
  }
}
