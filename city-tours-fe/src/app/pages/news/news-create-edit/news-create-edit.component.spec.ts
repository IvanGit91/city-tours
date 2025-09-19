import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NewsCreateEditComponent} from './news-create-edit.component';

describe('NewsCreateEditComponent', () => {
  let component: NewsCreateEditComponent;
  let fixture: ComponentFixture<NewsCreateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewsCreateEditComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
