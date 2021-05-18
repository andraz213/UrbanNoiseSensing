import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ReviewDeploymentComponent} from './review-deployment.component';

describe('ReviewDeploymentComponent', () => {
  let component: ReviewDeploymentComponent;
  let fixture: ComponentFixture<ReviewDeploymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewDeploymentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewDeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
