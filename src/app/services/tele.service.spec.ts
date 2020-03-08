import { TestBed } from '@angular/core/testing';

import { TeleService } from './tele.service';

describe('TeleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TeleService = TestBed.get(TeleService);
    expect(service).toBeTruthy();
  });
});
