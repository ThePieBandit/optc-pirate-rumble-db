import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitDetailsCardComponent } from './unit-details-card.component';

describe('UnitDetailsCardComponent', () => {
  let component: UnitDetailsCardComponent;
  let fixture: ComponentFixture<UnitDetailsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitDetailsCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
