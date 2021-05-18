import {Component, Input, OnInit} from '@angular/core';
import {Deployment} from "../../models/deployment";
import {Sensor} from "../../models/sensor";
import {DeploymentService} from "../../services/deployment.service";
import {SensorService} from "../../services/sensor.service";

@Component({
  selector: 'app-sensor-map',
  templateUrl: './sensor-map.component.html',
  styleUrls: ['./sensor-map.component.css']
})
export class SensorMapComponent implements OnInit {

  constructor(private deploymentService: DeploymentService,
              private sensorService: SensorService,) {
  }

  @Input() id: string;
  @Input() deployment: Deployment;
  public mapType = "hybrid";
  public longitude = 0;
  public latitude = 0;
  public sensors: { sensor: any, alpha: number }[];

  ngOnInit() {
    console.log(this.deployment);
    this.getSensors();
  }

  private getSensors() {
    this.sensors = [];
    for (let sen of this.deployment.sensors) {

      this.sensors.push({sensor: sen, alpha: 0.4});
      this.longitude += sen.location[0] / this.deployment.sensors.length;
      // @ts-ignore
      this.latitude += sen.location[1] / this.deployment.sensors.length;
      console.log(sen);
    }


    console.log(this.deployment);
    console.log(this.sensors);
    console.log(this.longitude);
    console.log(this.latitude);
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
}
