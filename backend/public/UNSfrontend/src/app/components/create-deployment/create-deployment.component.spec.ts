import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDeploymentComponent } from './create-deployment.component';

describe('CreateDeploymentComponent', () => {
  let component: CreateDeploymentComponent;
  let fixture: ComponentFixture<CreateDeploymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDeploymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
