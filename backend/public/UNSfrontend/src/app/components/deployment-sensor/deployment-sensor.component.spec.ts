import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentSensorComponent } from './deployment-sensor.component';

describe('DeploymentSensorComponent', () => {
  let component: DeploymentSensorComponent;
  let fixture: ComponentFixture<DeploymentSensorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeploymentSensorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
