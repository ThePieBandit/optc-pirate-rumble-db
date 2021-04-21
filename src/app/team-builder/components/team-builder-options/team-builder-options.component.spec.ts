import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamBuilderOptionsComponent } from './team-builder-options.component';

describe('TeamBuilderOptionsComponent', () => {
  let component: TeamBuilderOptionsComponent;
  let fixture: ComponentFixture<TeamBuilderOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamBuilderOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamBuilderOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
