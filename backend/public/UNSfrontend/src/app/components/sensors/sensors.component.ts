import { Component, OnInit } from '@angular/core';
import { SensorService } from "../../services/sensor.service";
import { Sensor} from "../../models/sensor";
import {DeploymentService} from "../../services/deployment.service";
import {Deployment} from "../../models/deployment";

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.css']
})
export class SensorsComponent implements OnInit {


  constructor(
    private sensorService: SensorService,
    private deploymentService: DeploymentService
  ) { }

  public sensors: Sensor[];
  public deployments: Deployment[];

  ngOnInit() {
    this.getSensors();
    console.log("hej");
    console.log(this.sensorService);
  }

  private getSensors(){
    this.sensorService.getSensors().then(result => {
      console.log(result);
      this.sensors = result;
      this.getDeployments();
    });

  }


  private getDeployments(){
    this.deploymentService.getDeployments().then(result =>{
      for(let dep of result){
        for(let sn of this.sensors){
          if(sn.current_deployment != null){
            if(sn.current_deployment == dep._id){
              // @ts-ignore
              sn.deployment_name = dep.name;
            }
          }
        }
      }
      console.log(this.sensors);
    });
  }


}
