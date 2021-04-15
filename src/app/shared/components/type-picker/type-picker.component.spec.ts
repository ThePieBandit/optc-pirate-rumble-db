import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypePickerComponent } from './type-picker.component';

describe('TypePickerComponent', () => {
  let component: TypePickerComponent;
  let fixture: ComponentFixture<TypePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
