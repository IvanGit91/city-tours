import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UserOpComponent} from './user-op.component';

describe('UserCreateEditComponent', () => {
  let component: UserOpComponent;
  let fixture: ComponentFixture<UserOpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserOpComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
