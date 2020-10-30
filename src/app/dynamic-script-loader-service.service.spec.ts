import { TestBed } from '@angular/core/testing';

import { DynamicScriptLoaderServiceService } from './dynamic-script-loader-service.service';

describe('DynamicScriptLoaderServiceService', () => {
  let service: DynamicScriptLoaderServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicScriptLoaderServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
