import { TestBed } from '@angular/core/testing';

import { Estacao } from './estacao';

describe('Estacao', () => {
  let service: Estacao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Estacao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
