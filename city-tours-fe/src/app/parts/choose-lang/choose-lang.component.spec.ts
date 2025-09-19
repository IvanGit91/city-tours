import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ChooseLangComponent} from './choose-lang.component';

describe('ChooseLangComponent', () => {
  let component: ChooseLangComponent;
  let fixture: ComponentFixture<ChooseLangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChooseLangComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseLangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
