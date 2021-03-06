import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Deployment} from '../models/deployment';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient,) {
  }


  public getAverageDeployment(id: string): Promise<any> {
    const url = `${this.apiUrl}/data/deployment/average/` + id;
    return this.http
      .get(url)
      .toPromise()
      .then(answer => answer as any)
      .catch(this.obdelajNapako);
  }

  /*
    public finishDeployment(id: string): Promise<any>{
      const url = `${this.apiUrl}/deployment/finish/` + id;
      return this.http
        .get(url)
        .toPromise()
        .then(answer => answer as any)
        .catch(this.obdelajNapako);
    }

    public getOneDeployment(id: string): Promise<Deployment>{
      const url = `${this.apiUrl}/deployment/` + id;
      return this.http
        .get(url)
        .toPromise()
        .then(answer => answer as Deployment)
        .catch(this.obdelajNapako);
    }

    public deployDeployment(id: string): Promise<any>{
      const url = `${this.apiUrl}/deployment/deploy/` + id;
      return this.http
        .get(url)
        .toPromise()
        .then(answer => answer as any)
        .catch(this.obdelajNapako);
    }

    public updateDeployment(id: string, body: any): Promise<Deployment[]>{
      const url = `${this.apiUrl}/deployment/` + id;
      return this.http
        .put(url, body)
        .toPromise()
        .then(answer => answer as Deployment[])
        .catch(this.obdelajNapako);
    }

    public createDeployment(body: any): Promise<Deployment>{
      const url = `${this.apiUrl}/deployment/`;
      return this.http
        .post(url, body)
        .toPromise()
        .then(answer => answer as Deployment[])
        .catch(this.obdelajNapako);
    }
  */

  private obdelajNapako(napaka: any): Promise<any> {
    console.error('Error ', napaka.error.sporočilo || napaka.error.errmsg || napaka);
    return Promise.reject(napaka.error.sporočilo || napaka.error.errmsg || napaka);
  }
}
