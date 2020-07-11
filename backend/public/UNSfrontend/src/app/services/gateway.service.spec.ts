import { TestBed } from '@angular/core/testing';

import { GatewayService } from './gateway.service';

describe('GatewayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GatewayService = TestBed.get(GatewayService);
    expect(service).toBeTruthy();
  });
});
