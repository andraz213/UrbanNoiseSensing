import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentOverviewComponent } from './deployment-overview.component';

describe('DeploymentOverviewComponent', () => {
  let component: DeploymentOverviewComponent;
  let fixture: ComponentFixture<DeploymentOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeploymentOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
