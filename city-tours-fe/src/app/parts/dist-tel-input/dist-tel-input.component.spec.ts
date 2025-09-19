import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DistTelInputComponent} from './dist-tel-input.component';

describe('DistTelInputComponent', () => {
  let component: DistTelInputComponent;
  let fixture: ComponentFixture<DistTelInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DistTelInputComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistTelInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
