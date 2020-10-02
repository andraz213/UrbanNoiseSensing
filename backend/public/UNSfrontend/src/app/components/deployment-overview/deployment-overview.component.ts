import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {Deployment} from "../../models/deployment";
import {DeploymentService} from "../../services/deployment.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Router} from "@angular/router";

@Component({
  selector: 'app-deployment-overview',
  templateUrl: './deployment-overview.component.html',
  styleUrls: ['./deployment-overview.component.css']
})
export class DeploymentOverviewComponent implements OnInit {

  constructor(private deploymentService: DeploymentService,
              private modalService: BsModalService,
              private router: Router) { }

  @Input() id: string;
  @Input() deployment: Deployment;
  modalRef: BsModalRef;

  ngOnInit() {
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


}
