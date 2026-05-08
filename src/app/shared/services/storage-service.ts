import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AppConstants } from '../constants/app.constant';
import { StorageKeyEnum } from '../enums/storage-keys.enum';
import { WeekDaysEnum } from '../enums/week-days.enum';
import { INameValue } from '../interfaces/name-value.interface';
import { UserSelection } from '../models/user-selection.model';
import { BrowserStorage } from '../utils/browser-storage';
import { CurrencyHelper } from '../utils/currency-helper';

const USER_SELECTION_KEYS = [
  StorageKeyEnum.Name,
  StorageKeyEnum.Rate,
  StorageKeyEnum.Frequency,
  StorageKeyEnum.Currency,
  StorageKeyEnum.Start,
  StorageKeyEnum.End,
  StorageKeyEnum.WorkDays,
];

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly localStoragePrefix = environment.localStoragePrefix;

  hasUserSelectionOnLocalStorage(personNumber: number): boolean {
    return USER_SELECTION_KEYS.every((key) =>
      Boolean(BrowserStorage.getLocalStorageItem(this.getLocalStorageFullKey(key, personNumber))),
    );
  }

  getUserSelectionFromLocalStorage(personNumber: number): UserSelection {
    const userSelection: UserSelection = new UserSelection(personNumber);

    this.applyStoredValues(userSelection, {
      name: this.getLocalStorageValue(StorageKeyEnum.Name, personNumber),
      rate: this.getLocalStorageValue(StorageKeyEnum.Rate, personNumber),
      frequency: this.getLocalStorageValue(StorageKeyEnum.Frequency, personNumber),
      currency: this.getLocalStorageValue(StorageKeyEnum.Currency, personNumber),
      start: this.getLocalStorageValue(StorageKeyEnum.Start, personNumber),
      end: this.getLocalStorageValue(StorageKeyEnum.End, personNumber),
      workDays: this.getLocalStorageValue(StorageKeyEnum.WorkDays, personNumber),
    });

    return userSelection;
  }

  saveUserSelectionOnLocalStorage(userSelection: UserSelection): void {
    const personNumber = userSelection.personNumber;

    BrowserStorage.setLocalStorageItem(
      this.getLocalStorageFullKey(StorageKeyEnum.Name, personNumber),
      userSelection.name,
    );
    BrowserStorage.setLocalStorageItem(
      this.getLocalStorageFullKey(StorageKeyEnum.Rate, personNumber),
      userSelection.rate.toString(),
    );
    BrowserStorage.setLocalStorageItem(
      this.getLocalStorageFullKey(StorageKeyEnum.Frequency, personNumber),
      userSelection.frequency.value.toString(),
    );
    BrowserStorage.setLocalStorageItem(
      this.getLocalStorageFullKey(StorageKeyEnum.Currency, personNumber),
      userSelection.currencySymbol,
    );
    BrowserStorage.setLocalStorageItem(
      this.getLocalStorageFullKey(StorageKeyEnum.Start, personNumber),
      userSelection.startTime,
    );
    BrowserStorage.setLocalStorageItem(
      this.getLocalStorageFullKey(StorageKeyEnum.End, personNumber),
      userSelection.endTime,
    );
    BrowserStorage.setLocalStorageItem(
      this.getLocalStorageFullKey(StorageKeyEnum.WorkDays, personNumber),
      this.getWorkingDaysFromArray(userSelection.weekWorkingDays),
    );
  }

  saveUserSelectionsOnLocalStorage(userSelections: Array<UserSelection>): void {
    this.cleanUserSelectionsOnLocalStorage();

    userSelections.forEach((us: UserSelection) => {
      this.saveUserSelectionOnLocalStorage(us);
    });
  }

  private getLocalStorageFullKey(key: string, personNumber: number): string {
    return `${this.localStoragePrefix}${key}${personNumber}`;
  }

  private getLocalStorageValue(key: string, personNumber: number): string {
    return BrowserStorage.getLocalStorageItem(this.getLocalStorageFullKey(key, personNumber)) ?? '';
  }

  private getURLFullParamKey(key: string, personNumber: number): string {
    return `${key}${personNumber}`;
  }

  cleanUserSelectionsOnLocalStorage(): void {
    for (
      let personNumber = 1;
      personNumber <= AppConstants.Common.COMPARE_TOOL_MAX_PERSONS;
      personNumber++
    ) {
      USER_SELECTION_KEYS.forEach((key) => {
        BrowserStorage.removeLocalStorageItem(this.getLocalStorageFullKey(key, personNumber));
      });
    }
  }

  hasUserSelectionOnURL(personNumber: number): boolean {
    const queryParams: Params = this.activatedRoute.snapshot.queryParams;

    return USER_SELECTION_KEYS.every(
      (key) => queryParams[this.getURLFullParamKey(key, personNumber)],
    );
  }

  getUserSelectionFromURL(personNumber: number): UserSelection {
    const queryParams = this.activatedRoute.snapshot.queryParams;

    const userSelection: UserSelection = new UserSelection(personNumber);

    this.applyStoredValues(userSelection, {
      name: queryParams[this.getURLFullParamKey(StorageKeyEnum.Name, personNumber)],
      rate: queryParams[this.getURLFullParamKey(StorageKeyEnum.Rate, personNumber)],
      frequency: queryParams[this.getURLFullParamKey(StorageKeyEnum.Frequency, personNumber)],
      currency: queryParams[this.getURLFullParamKey(StorageKeyEnum.Currency, personNumber)],
      start: queryParams[this.getURLFullParamKey(StorageKeyEnum.Start, personNumber)],
      end: queryParams[this.getURLFullParamKey(StorageKeyEnum.End, personNumber)],
      workDays: queryParams[this.getURLFullParamKey(StorageKeyEnum.WorkDays, personNumber)],
    });

    return userSelection;
  }

  setUserSelectionOnURL(userSelection: UserSelection): void {
    const personNumber = userSelection.personNumber;

    const params: Params = {};

    params[this.getURLFullParamKey(StorageKeyEnum.Name, personNumber)] = userSelection.name;
    params[this.getURLFullParamKey(StorageKeyEnum.Rate, personNumber)] = userSelection.rate;
    params[this.getURLFullParamKey(StorageKeyEnum.Frequency, personNumber)] =
      userSelection.frequency.value;
    params[this.getURLFullParamKey(StorageKeyEnum.Currency, personNumber)] =
      userSelection.currencySymbol;
    params[this.getURLFullParamKey(StorageKeyEnum.Start, personNumber)] = userSelection.startTime;
    params[this.getURLFullParamKey(StorageKeyEnum.End, personNumber)] = userSelection.endTime;
    params[this.getURLFullParamKey(StorageKeyEnum.WorkDays, personNumber)] =
      this.getWorkingDaysFromArray(userSelection.weekWorkingDays);

    void this.router.navigate(['/'], { queryParams: params });
  }

  setUserSelectionsOnURL(userSelections: Array<UserSelection>): void {
    const params: Params = {};

    userSelections.forEach((us: UserSelection) => {
      params[this.getURLFullParamKey(StorageKeyEnum.Name, us.personNumber)] = us.name;
      params[this.getURLFullParamKey(StorageKeyEnum.Rate, us.personNumber)] = us.rate;
      params[this.getURLFullParamKey(StorageKeyEnum.Frequency, us.personNumber)] =
        us.frequency.value;
      params[this.getURLFullParamKey(StorageKeyEnum.Currency, us.personNumber)] = us.currencySymbol;
      params[this.getURLFullParamKey(StorageKeyEnum.Start, us.personNumber)] = us.startTime;
      params[this.getURLFullParamKey(StorageKeyEnum.End, us.personNumber)] = us.endTime;
      params[this.getURLFullParamKey(StorageKeyEnum.WorkDays, us.personNumber)] =
        this.getWorkingDaysFromArray(us.weekWorkingDays);
    });

    void this.router.navigate(['/compare'], { queryParams: params });
  }

  private applyStoredValues(
    userSelection: UserSelection,
    values: {
      name: unknown;
      rate: unknown;
      frequency: unknown;
      currency: unknown;
      start: unknown;
      end: unknown;
      workDays: unknown;
    },
  ): void {
    const name = this.toTextValue(values.name);
    if (name) {
      userSelection.name = name;
    }

    const rateText = this.toTextValue(values.rate);
    const rate = Number(rateText);
    if (rateText && Number.isFinite(rate) && rate > 0) {
      userSelection.rate = rate;
    }

    const frequency = this.getFrequencyByValue(this.toTextValue(values.frequency));
    if (frequency) {
      userSelection.frequency = frequency;
    }

    const currency = this.toTextValue(values.currency);
    userSelection.currencySymbol =
      CurrencyHelper.getSupportedCurrencySymbol(currency) ??
      CurrencyHelper.getPreferredCurrencySymbol();

    const start = this.toTextValue(values.start);
    if (this.isValidTime(start)) {
      userSelection.startTime = start;
    }

    const end = this.toTextValue(values.end);
    if (this.isValidTime(end)) {
      userSelection.endTime = end;
    }

    const workDays = this.toTextValue(values.workDays);
    if (workDays) {
      userSelection.weekWorkingDays = this.getWorkingDaysFromString(workDays);
    }
  }

  private toTextValue(value: unknown): string {
    if (Array.isArray(value)) {
      return this.toTextValue(value[0]);
    }

    if (value === null || value === undefined) {
      return '';
    }

    return String(value);
  }

  private getFrequencyByValue(value: string): INameValue | null {
    return AppConstants.Common.FREQUENCIES.find((frequency) => frequency.value === value) ?? null;
  }

  private isValidTime(text: string): boolean {
    let result = false;

    if (text.length === 5) {
      const hours = +text.substring(0, 2);
      const separator = text.substring(2, 3);
      const minutes = +text.substring(3, 5);

      if (separator === ':' && Number.isFinite(hours) && Number.isFinite(minutes)) {
        if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
          result = true;
        }
      }
    }

    return result;
  }

  private getWorkingDaysFromString(workDaysText: string): boolean[] {
    const result = Array<boolean>(7).fill(false);

    workDaysText.split(',').forEach((wd) => {
      const wdNumber: number = Number(wd);
      if (
        Number.isFinite(wdNumber) &&
        wdNumber >= WeekDaysEnum.Sunday &&
        wdNumber <= WeekDaysEnum.Saturday
      ) {
        result[wdNumber] = true;
      }
    });

    return result;
  }

  private getWorkingDaysFromArray(workDaysArray: boolean[]): string {
    const workDaysIndexes: number[] = [];
    workDaysArray.forEach((wd, index) => {
      if (wd === true) {
        workDaysIndexes.push(index);
      }
    });
    return workDaysIndexes.join(',');
  }
}
