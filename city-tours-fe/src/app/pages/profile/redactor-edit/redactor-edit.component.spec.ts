import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RedactorEditComponent} from './redactor-edit.component';

describe('RedactorEditComponent', () => {
  let component: RedactorEditComponent;
  let fixture: ComponentFixture<RedactorEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RedactorEditComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedactorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
