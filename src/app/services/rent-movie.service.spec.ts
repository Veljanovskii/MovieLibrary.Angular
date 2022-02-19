import { TestBed } from '@angular/core/testing';

import { RentMovieService } from './rent-movie.service';

describe('RentMovieService', () => {
  let service: RentMovieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RentMovieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
