import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuffPickerComponent } from './buff-picker.component';

describe('BuffPickerComponent', () => {
  let component: BuffPickerComponent;
  let fixture: ComponentFixture<BuffPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuffPickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuffPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
