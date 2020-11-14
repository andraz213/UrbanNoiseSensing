import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentStatisticsComponent } from './deployment-statistics.component';

describe('DeploymentStatisticsComponent', () => {
  let component: DeploymentStatisticsComponent;
  let fixture: ComponentFixture<DeploymentStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeploymentStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
