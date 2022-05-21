import { TestBed } from '@angular/core/testing';

import { AdminApiService } from './admin-api.service';

describe('AdminApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminApiService = TestBed.get(AdminApiService);
    expect(service).toBeTruthy();
  });
});
