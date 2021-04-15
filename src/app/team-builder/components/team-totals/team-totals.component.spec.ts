import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTotalsComponent } from './team-totals.component';

describe('TeamTotalsComponent', () => {
  let component: TeamTotalsComponent;
  let fixture: ComponentFixture<TeamTotalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamTotalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
