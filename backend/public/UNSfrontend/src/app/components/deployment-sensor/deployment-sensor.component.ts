import {Component, Input, OnInit} from '@angular/core';
import {DeploymentService} from "../../services/deployment.service";
import {SensorService} from "../../services/sensor.service";
import {GatewayService} from "../../services/gateway.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BsModalService} from "ngx-bootstrap/modal";
import {Deployment} from "../../models/deployment";
import {Sensor} from "../../models/sensor";

@Component({
  selector: 'app-deployment-sensor',
  templateUrl: './deployment-sensor.component.html',
  styleUrls: ['./deployment-sensor.component.css']
})
export class DeploymentSensorComponent implements OnInit {

  constructor(private deploymentService: DeploymentService,
              private sensorService: SensorService,
              private gatewayService: GatewayService,
              private activatedRoute: ActivatedRoute,
              private modalService: BsModalService,
              private router: Router) {
  }

  @Input() id: string;
  @Input() deployment: Deployment;
  public mapType = "hybrid";
  public longitude = 0;
  public latitude = 0;
  public sensors: { sensor: Sensor, alpha: number, measurements: number }[];

  ngOnInit() {

    this.getSensors();


  }


  private findnumber(id: String) {
    for (let sn of this.deployment.number_agregate) {
      if (sn.sensor == id) {
        return (sn.num);
      }

    }
    return 0;

  }

  private getSensors() {
    this.sensors = [];
    for (let sen of this.deployment.sensors) {
      this.sensorService.getOneSensor(sen.sensor_id).then((reses) => {
        console.log(reses);
        let res = reses[0];
        this.sensors.push({sensor: res, alpha: 0.4, measurements: this.findnumber(sen.sensor_id)});
        this.longitude += res.current_location[0] / this.deployment.sensors.length;
        // @ts-ignore
        this.latitude += res.current_location[1] / this.deployment.sensors.length;
        console.log(res);
      });
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
