import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenosrMapComponent } from './senosr-map.component';

describe('SenosrMapComponent', () => {
  let component: SenosrMapComponent;
  let fixture: ComponentFixture<SenosrMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SenosrMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SenosrMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
