import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedDeploymentComponent } from './finished-deployment.component';

describe('FinishedDeploymentComponent', () => {
  let component: FinishedDeploymentComponent;
  let fixture: ComponentFixture<FinishedDeploymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishedDeploymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishedDeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
