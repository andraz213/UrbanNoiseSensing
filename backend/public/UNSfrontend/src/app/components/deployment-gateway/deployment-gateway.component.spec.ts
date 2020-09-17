import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentGatewayComponent } from './deployment-gateway.component';

describe('DeploymentGatewayComponent', () => {
  let component: DeploymentGatewayComponent;
  let fixture: ComponentFixture<DeploymentGatewayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeploymentGatewayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
