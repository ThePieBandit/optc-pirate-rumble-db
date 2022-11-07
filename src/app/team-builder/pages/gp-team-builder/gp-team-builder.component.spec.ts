import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrandPartyTeamBuilderComponent } from './gp-team-builder.component';

describe('TeamBuilderComponent', () => {
  let component: GrandPartyTeamBuilderComponent;
  let fixture: ComponentFixture<GrandPartyTeamBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrandPartyTeamBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrandPartyTeamBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
