import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Gateway } from '../models/gateway';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GatewayService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, ) { }



  public getGateways(): Promise<Gateway[]>{
    const url = `${this.apiUrl}/gateway`;
    return this.http
      .get(url)
      .toPromise()
      .then(answer => answer as Gateway[])
      .catch(this.obdelajNapako);
  }

  public getOneGateway(id: string): Promise<Gateway[]>{
    const url = `${this.apiUrl}/gateway/` + id;
    return this.http
      .get(url)
      .toPromise()
      .then(answer => answer as Gateway[])
      .catch(this.obdelajNapako);
  }

  public updateGateway(id: string, body: string): Promise<Gateway[]>{
    const url = `${this.apiUrl}/sensor/` + id;
    return this.http
      .put(url, body)
      .toPromise()
      .then(answer => answer as Gateway[])
      .catch(this.obdelajNapako);
  }


  private obdelajNapako(napaka: any): Promise<any> {
    console.error('Error ', napaka.error.sporočilo || napaka.error.errmsg || napaka);
    return Promise.reject(napaka.error.sporočilo || napaka.error.errmsg || napaka);
  }
}


