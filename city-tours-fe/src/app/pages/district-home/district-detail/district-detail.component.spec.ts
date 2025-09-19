import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DistrictDetailComponent} from "./district-detail.component";


describe('PoiDetailComponent', () => {
  let component: DistrictDetailComponent;
  let fixture: ComponentFixture<DistrictDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DistrictDetailComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
