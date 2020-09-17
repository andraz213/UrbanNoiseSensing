import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreMomentsComponent } from './explore-moments.component';

describe('ExploreMomentsComponent', () => {
  let component: ExploreMomentsComponent;
  let fixture: ComponentFixture<ExploreMomentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreMomentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreMomentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
