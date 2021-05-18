import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {DeploymentService} from "../../services/deployment.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Router} from "@angular/router";
import {Deployment} from "../../models/deployment";

@Component({
  selector: 'app-delete-deployment',
  templateUrl: './delete-deployment.component.html',
  styleUrls: ['./delete-deployment.component.css']
})
export class DeleteDeploymentComponent implements OnInit {

  @Input() id: string;
  @Input() deployment: Deployment;

  constructor(private deploymentService: DeploymentService,
              private modalService: BsModalService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  modalRef: BsModalRef;


  public deleteDeployment() {
    this.deploymentService.deleteDeployment(this.deployment._id).then(res => {
      this.decline();
      console.log(res);
      this.router.navigateByUrl(`deployments`);

    });
    this.decline();
    this.router.navigateByUrl(`deployments`);
  }


  public decline(): void {
    this.modalRef.hide();
  }


  public openModal(confirm: TemplateRef<any>) {

    this.modalRef = this.modalService.show(confirm, {class: 'modal-sm'});

  }

}
