import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Sensor} from '../models/sensor';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient,) {
  }

  public getSensors(): Promise<Sensor[]> {
    console.log(this.apiUrl);
    const url = `${this.apiUrl}/sensor`;
    return this.http
      .get(url)
      .toPromise()
      .then(answer => answer as Sensor[])
      .catch(this.obdelajNapako);
  }

  public getOneSensor(id: string): Promise<Sensor> {
    const url = `${this.apiUrl}/sensor/` + id;
    return this.http
      .get(url)
      .toPromise()
      .then(answer => answer as Sensor)
      .catch(this.obdelajNapako);
  }

  public updateSensor(id: string, body: string): Promise<Sensor[]> {
    const url = `${this.apiUrl}/sensor/` + id;
    return this.http
      .put(url, body)
      .toPromise()
      .then(answer => answer as Sensor[])
      .catch(this.obdelajNapako);
  }


  private obdelajNapako(napaka: any): Promise<any> {
    console.error('Error ', napaka.error.sporočilo || napaka.error.errmsg || napaka);
    return Promise.reject(napaka.error.sporočilo || napaka.error.errmsg || napaka);
  }

}
