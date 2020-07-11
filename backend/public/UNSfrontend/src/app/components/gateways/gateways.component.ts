import { Component, OnInit } from '@angular/core';
import { Gateway } from "../../models/gateway";
import { GatewayService } from "../../services/gateway.service";

@Component({
  selector: 'app-gateways',
  templateUrl: './gateways.component.html',
  styleUrls: ['./gateways.component.css']
})
export class GatewaysComponent implements OnInit {

  constructor(
    private gatewayService: GatewayService
  ) { }

  public gateways: Gateway[];

  ngOnInit() {
    console.log("hej");
    this.getGateways();
  }

  private getGateways(){
    this.gatewayService.getGateways().then(result => {
      this.gateways = result;
    });

  }

}
