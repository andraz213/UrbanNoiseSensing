import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageChartComponent } from './average-chart.component';

describe('AverageChartComponent', () => {
  let component: AverageChartComponent;
  let fixture: ComponentFixture<AverageChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AverageChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AverageChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
