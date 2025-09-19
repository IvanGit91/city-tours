import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DistrictHomeComponent} from "./district-home.component";


describe('DistrettiHomeComponent', () => {
  let component: DistrictHomeComponent;
  let fixture: ComponentFixture<DistrictHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DistrictHomeComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
