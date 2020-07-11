import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-edit-deployment',
  templateUrl: './edit-deployment.component.html',
  styleUrls: ['./edit-deployment.component.css']
})
export class EditDeploymentComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,) { }

  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get("id");
  }

}
