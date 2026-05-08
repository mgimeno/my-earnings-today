import '@angular/compiler';
import { Injector, runInInjectionContext } from '@angular/core';
import '@angular/localize/init';
import { ActivatedRoute, Router } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppConstants } from '../constants/app.constant';
import { UserSelection } from '../models/user-selection.model';
import { StorageService } from './storage-service';

describe('StorageService', () => {
  const originalLanguages = navigator.languages;
  const originalLanguage = navigator.language;

  let queryParams: Record<string, unknown>;
  let router: { navigate: ReturnType<typeof vi.fn> };
  let storageService: StorageService;

  beforeEach(() => {
    queryParams = {};
    router = { navigate: vi.fn() };

    const injector = Injector.create({
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams } } },
        { provide: Router, useValue: router },
      ],
    });

    storageService = runInInjectionContext(injector, () => new StorageService());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
    setNavigatorValue('languages', originalLanguages);
    setNavigatorValue('language', originalLanguage);
  });

  it('loads a valid user selection from URL params', () => {
    queryParams = {
      name1: 'Alex',
      rate1: '42.5',
      frequency1: 'hour',
      currency1: '€',
      start1: '09:30',
      end1: '18:00',
      workdays1: '1,3,5',
    };
    storageService = createService(queryParams, router);

    const userSelection = storageService.getUserSelectionFromURL(1);

    expect(userSelection.name).toBe('Alex');
    expect(userSelection.rate).toBe(42.5);
    expect(userSelection.frequency).toEqual(AppConstants.Common.FREQUENCIES[0]);
    expect(userSelection.currencySymbol).toBe('€');
    expect(userSelection.startTime).toBe('09:30');
    expect(userSelection.endTime).toBe('18:00');
    expect(userSelection.weekWorkingDays).toEqual([false, true, false, true, false, true, false]);
  });

  it('sanitizes invalid URL values and keeps safe defaults', () => {
    setNavigatorValue('languages', ['en-US']);
    queryParams = {
      name1: '',
      rate1: 'Infinity',
      frequency1: 'bad',
      currency1: 'bad',
      start1: '25:00',
      end1: 'nope',
      workdays1: '0,6,9,nope',
    };
    storageService = createService(queryParams, router);

    const userSelection = storageService.getUserSelectionFromURL(1);

    expect(userSelection.name).toBe('You');
    expect(userSelection.rate).toBeNull();
    expect(userSelection.frequency).toBeNull();
    expect(userSelection.currencySymbol).toBe('$');
    expect(userSelection.startTime).toBeNull();
    expect(userSelection.endTime).toBeNull();
    expect(userSelection.weekWorkingDays).toEqual([true, false, false, false, false, false, true]);
  });

  it('writes user selections to URL params', () => {
    const userSelection = new UserSelection(2);
    userSelection.name = 'Marta';
    userSelection.rate = 100;
    userSelection.frequency = AppConstants.Common.FREQUENCIES[3];
    userSelection.currencySymbol = '€';
    userSelection.startTime = '08:00';
    userSelection.endTime = '16:30';
    userSelection.weekWorkingDays = [false, true, true, true, true, true, false];

    storageService.setUserSelectionOnURL(userSelection);

    expect(router.navigate).toHaveBeenCalledWith(['/'], {
      queryParams: {
        name2: 'Marta',
        rate2: 100,
        frequency2: 'month',
        currency2: '€',
        start2: '08:00',
        end2: '16:30',
        workdays2: '1,2,3,4,5',
      },
    });
  });

  function createService(
    params: Record<string, unknown>,
    routerStub: { navigate: ReturnType<typeof vi.fn> },
  ): StorageService {
    const injector = Injector.create({
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: params } } },
        { provide: Router, useValue: routerStub },
      ],
    });

    return runInInjectionContext(injector, () => new StorageService());
  }

  function setNavigatorValue(key: 'language' | 'languages', value: unknown): void {
    Object.defineProperty(navigator, key, {
      configurable: true,
      value,
    });
  }
});
