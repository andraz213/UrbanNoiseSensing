import {Component, HostListener, Input, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-average-chart',
  templateUrl: './average-chart.component.html',
  styleUrls: ['./average-chart.component.css']
})
export class AverageChartComponent implements OnInit {

  @Input() id: string;

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = '';
  yAxisLabel: string = 'Average decibels';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };


  average_data:[any];

  constructor(private dataservice: DataService) { }

  ngOnInit(): void {
    this.getAverages();
  }


  private getAverages(){

    this.dataservice.getAverageDeployment(this.id).then(data =>{
      let temp_data = {};
      temp_data["name"] = "averages";
      temp_data["series"] = [];
      let ticks = [];

      for(let dd of data){
        let one = {};
        one["name"] = this.formatDateXAxis(new Date(dd.time));
        one["value"] = dd.average;
        temp_data["series"].push(one);

        console.log(one["name"]);

      }

      this.average_data = [temp_data];
      console.log(this.average_data);
    });
  }

  scrHeight:any;
  scrWidth:any;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
    console.log(window);
    console.log(this.scrHeight, this.scrWidth);
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


  formatDateXAxis(date: Date){
    let res = "";

    if(date.getDate() < 10){
      res += "0";
    }
    res += date.getDate();
    res += ".";
    if(date.getMonth() < 10){
      res += "0";
    }
    res += date.getMonth() +1;
    res += ". ";
    if(date.getHours() < 10){
      res += "0";
    }

    res += date.getHours();
    res += ":";
    if(date.getMinutes() < 10){
      res += "0";
    }
    res += date.getMinutes();

    return res;

  }
}
