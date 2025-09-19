import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PoiOpComponent} from './poi-op.component';

describe('PoiOpComponent', () => {
  let component: PoiOpComponent;
  let fixture: ComponentFixture<PoiOpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoiOpComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoiOpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
