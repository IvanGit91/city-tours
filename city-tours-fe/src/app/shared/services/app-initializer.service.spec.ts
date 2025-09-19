import {inject, TestBed} from '@angular/core/testing';

import {AppInitializerService} from './app-initializer.service';

describe('AppInitializerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppInitializerService]
    });
  });

  it('should be created', inject([AppInitializerService], (service: AppInitializerService) => {
    expect(service).toBeTruthy();
  }));
});
