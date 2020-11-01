import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionBarComponent } from './option-bar.component';

describe('OptionBarComponent', () => {
  let component: OptionBarComponent;
  let fixture: ComponentFixture<OptionBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
