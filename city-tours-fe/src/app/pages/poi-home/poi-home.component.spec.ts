import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PoiHomeComponent} from './poi-home.component';

describe('PoiHomeComponent', () => {
  let component: PoiHomeComponent;
  let fixture: ComponentFixture<PoiHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoiHomeComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoiHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
