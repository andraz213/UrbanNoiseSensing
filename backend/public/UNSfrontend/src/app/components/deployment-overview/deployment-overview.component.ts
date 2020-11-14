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

  public depDTO: Deployment;




  ngOnInit() {
    this.depDTO = this.deployment;
    console.log(this.depDTO.measurement_interval);

  }

  public saveChangesForm(bad_interval: TemplateRef<any>, updated_interval: TemplateRef<any>) {
    if(this.depDTO.measurement_interval < 1){
      this.modalRef = this.modalService.show(bad_interval, {class: 'modal-sm'});
    }else {
      this.deploymentService.updateDeploymentInterval(this.id, this.depDTO.measurement_interval).then(res => {
        console.log(res);
        this.deployment = res;
        this.modalRef = this.modalService.show(updated_interval, {class: 'modal-sm'});
      });
    }

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
