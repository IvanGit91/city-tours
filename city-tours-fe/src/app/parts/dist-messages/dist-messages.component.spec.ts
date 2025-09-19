import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DistMessagesComponent} from "./dist-messages.component";

describe('PizzaPartyComponent', () => {
  let component: DistMessagesComponent;
  let fixture: ComponentFixture<DistMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DistMessagesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
