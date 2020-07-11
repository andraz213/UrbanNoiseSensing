import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorMapComponent } from './sensor-map.component';

describe('SensorMapComponent', () => {
  let component: SensorMapComponent;
  let fixture: ComponentFixture<SensorMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
