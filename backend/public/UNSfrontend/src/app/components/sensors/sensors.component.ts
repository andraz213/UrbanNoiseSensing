import { Component, OnInit } from '@angular/core';
import { SensorService } from "../../services/sensor.service";
import { Sensor} from "../../models/sensor";

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.css']
})
export class SensorsComponent implements OnInit {


  constructor(
    private sensorService: SensorService
  ) { }

  public sensors: Sensor[];

  ngOnInit() {
    this.getSensors();
    console.log("hej");
    console.log(this.sensorService);
  }

  private getSensors(){
    this.sensorService.getSensors().then(result => {
      console.log(result);
      this.sensors = result;
    });

  }



}
