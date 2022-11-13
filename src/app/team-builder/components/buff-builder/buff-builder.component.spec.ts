import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuffBuilderComponent } from './buff-builder.component';

describe('BuffBuilderComponent', () => {
  let component: BuffBuilderComponent;
  let fixture: ComponentFixture<BuffBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuffBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuffBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
