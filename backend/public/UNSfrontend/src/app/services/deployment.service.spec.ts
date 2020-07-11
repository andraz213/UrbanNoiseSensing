import { TestBed } from '@angular/core/testing';

import { DeploymentService } from './deployment.service';

describe('DeploymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeploymentService = TestBed.get(DeploymentService);
    expect(service).toBeTruthy();
  });
});
