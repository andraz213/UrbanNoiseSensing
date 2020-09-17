import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentDataComponent } from './deployment-data.component';

describe('DeploymentDataComponent', () => {
  let component: DeploymentDataComponent;
  let fixture: ComponentFixture<DeploymentDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeploymentDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
