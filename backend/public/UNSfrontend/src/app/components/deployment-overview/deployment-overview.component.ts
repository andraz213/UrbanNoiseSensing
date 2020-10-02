import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {Deployment} from "../../models/deployment";
import {DeploymentService} from "../../services/deployment.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Router} from "@angular/router";
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-deployment-overview',
  templateUrl: './deployment-overview.component.html',
  styleUrls: ['./deployment-overview.component.css']
})
export class DeploymentOverviewComponent implements OnInit {

  constructor(private deploymentService: DeploymentService,
              private modalService: BsModalService,
              private router: Router,
              private dataservice: DataService) { }

  @Input() id: string;
  @Input() deployment: Deployment;
  modalRef: BsModalRef;

  view: any[] = [700, 300];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  multi = [
    {
      "name": "Germany",
      "series": [
        {
          "name": "1990",
          "value": 62000000
        },
        {
          "name": "2010",
          "value": 73000000
        },
        {
          "name": "2011",
          "value": 89400000
        }
      ]
    },

    {
      "name": "USA",
      "series": [
        {
          "name": "1990",
          "value": 250000000
        },
        {
          "name": "2010",
          "value": 309000000
        },
        {
          "name": "2011",
          "value": 311000000
        }
      ]
    },

    {
      "name": "France",
      "series": [
        {
          "name": "1990",
          "value": 58000000
        },
        {
          "name": "2010",
          "value": 50000020
        },
        {
          "name": "2011",
          "value": 58000000
        }
      ]
    },
    {
      "name": "UK",
      "series": [
        {
          "name": "1990",
          "value": 57000000
        },
        {
          "name": "2010",
          "value": 62000000
        }
      ]
    }
  ];


  average_data:[any];

  ngOnInit() {
    this.getAverages();

  }


  private getAverages(){

    this.dataservice.getAverageDeployment(this.id).then(data =>{
      let temp_data = {};
      temp_data["name"] = "averages";
      temp_data["series"] = [];

      for(let dd of data){
        let one = {};
        one["name"] = dd.time;
        one["value"] = dd.average;
        temp_data["series"].push(one);
      }

      this.average_data = [temp_data];
      console.log(this.average_data);
    });
  }

  public finishDeployment(){
    this.deploymentService.finishDeployment(this.deployment._id).then((data) =>{
      console.log(data);
      this.modalRef.hide();
      this.navigateBack();
    });

  }

  public openModal(confirm: TemplateRef<any>) {

    this.modalRef = this.modalService.show(confirm, {class: 'modal-sm'});

  }

  public decline(): void {
    this.modalRef.hide();
  }

  public navigateBack(){
    this.router.navigateByUrl(`deployments`);
  }


  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
