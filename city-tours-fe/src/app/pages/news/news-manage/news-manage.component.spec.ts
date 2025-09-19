import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NewsManageComponent} from './news-manage.component';

describe('NewsManageComponent', () => {
  let component: NewsManageComponent;
  let fixture: ComponentFixture<NewsManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewsManageComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
