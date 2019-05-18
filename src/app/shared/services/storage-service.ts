import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserSelection } from '../models/user-selection.model';
import { AppConstants } from '../constants/app-constants';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { WeekDaysEnum } from '../enums/week-days.enum';
import { StorageKeyEnum } from '../enums/storage-keys.enum';


@Injectable({
  providedIn: 'root'
})

export class StorageService {

  private readonly localStoragePrefix = environment.localStoragePrefix;


  constructor(private activatedRoute: ActivatedRoute, private router: Router) {

  }

  hasUserSelectionOnLocalStorage(personNumber: number): boolean {

    return (
         (localStorage[this.getLocalStorageFullKey(StorageKeyEnum.Name, personNumber)])
      && (localStorage[this.getLocalStorageFullKey(StorageKeyEnum.Rate, personNumber)])
      && (localStorage[this.getLocalStorageFullKey(StorageKeyEnum.Frequency, personNumber)])
      && (localStorage[this.getLocalStorageFullKey(StorageKeyEnum.Currency, personNumber)])
      && (localStorage[this.getLocalStorageFullKey(StorageKeyEnum.Start, personNumber)])
      && (localStorage[this.getLocalStorageFullKey(StorageKeyEnum.End, personNumber)])
      && (localStorage[this.getLocalStorageFullKey(StorageKeyEnum.WorkDays, personNumber)]));
  }

  getUserSelectionFromLocalStorage(personNumber: number): UserSelection {

    let userSelection: UserSelection = new UserSelection(personNumber);

    userSelection.name = localStorage[this.getLocalStorageFullKey(StorageKeyEnum.Name, personNumber)];
    userSelection.rate = localStorage[this.getLocalStorageFullKey(StorageKeyEnum.Rate, personNumber)];
    userSelection.currencySymbol = localStorage[this.getLocalStorageFullKey(StorageKeyEnum.Currency, personNumber)];
    userSelection.startTime = localStorage[this.getLocalStorageFullKey(StorageKeyEnum.Start, personNumber)];
    userSelection.endTime = localStorage[this.getLocalStorageFullKey(StorageKeyEnum.End, personNumber)];

    let indexOnArray = AppConstants.Common.FREQUENCIES.map(rf => rf.value).indexOf(localStorage[this.getLocalStorageFullKey(StorageKeyEnum.Frequency, personNumber)]);
    if (indexOnArray != -1) {
      userSelection.frequency = AppConstants.Common.FREQUENCIES[indexOnArray];
    }

    let workDays = localStorage[this.getLocalStorageFullKey(StorageKeyEnum.WorkDays, personNumber)];
    userSelection.weekWorkingDays = this.getWorkingDaysFromString(workDays);

    return userSelection;

  }

  saveUserSelectionOnLocalStorage(userSelection: UserSelection): void {

    let personNumber = userSelection.personNumber;

    localStorage[this.getLocalStorageFullKey(StorageKeyEnum.Name, personNumber)] = userSelection.name;
    localStorage[this.getLocalStorageFullKey(StorageKeyEnum.Rate, personNumber)] = userSelection.rate;
    localStorage[this.getLocalStorageFullKey(StorageKeyEnum.Frequency, personNumber)] = userSelection.frequency.value;
    localStorage[this.getLocalStorageFullKey(StorageKeyEnum.Currency, personNumber)] = userSelection.currencySymbol;
    localStorage[this.getLocalStorageFullKey(StorageKeyEnum.Start, personNumber)] = userSelection.startTime;
    localStorage[this.getLocalStorageFullKey(StorageKeyEnum.End, personNumber)] = userSelection.endTime;
    localStorage[this.getLocalStorageFullKey(StorageKeyEnum.WorkDays, personNumber)] = this.getWorkingDaysFromArray(userSelection.weekWorkingDays);
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

  private getURLFullParamKey(key: string, personNumber: number): string {
    return `${key}${personNumber}`;
  }

  cleanUserSelectionsOnLocalStorage(): void {

    for (let personNumber = 1; personNumber <= environment.compareToolMaxPersons; personNumber++) {

      localStorage.removeItem(this.getLocalStorageFullKey(StorageKeyEnum.Name, personNumber));
      localStorage.removeItem(this.getLocalStorageFullKey(StorageKeyEnum.Rate, personNumber));
      localStorage.removeItem(this.getLocalStorageFullKey(StorageKeyEnum.Frequency, personNumber));
      localStorage.removeItem(this.getLocalStorageFullKey(StorageKeyEnum.Currency, personNumber));
      localStorage.removeItem(this.getLocalStorageFullKey(StorageKeyEnum.Start, personNumber));
      localStorage.removeItem(this.getLocalStorageFullKey(StorageKeyEnum.End, personNumber));
      localStorage.removeItem(this.getLocalStorageFullKey(StorageKeyEnum.WorkDays, personNumber));

    }
  }

  hasUserSelectionOnURL(personNumber: number): boolean {
    let queryParams: Params = this.activatedRoute.snapshot.queryParams;

    return (
         queryParams[this.getURLFullParamKey(StorageKeyEnum.Name, personNumber)]
      && queryParams[this.getURLFullParamKey(StorageKeyEnum.Rate, personNumber)]
      && queryParams[this.getURLFullParamKey(StorageKeyEnum.Frequency, personNumber)]
      && queryParams[this.getURLFullParamKey(StorageKeyEnum.Currency, personNumber)]
      && queryParams[this.getURLFullParamKey(StorageKeyEnum.Start, personNumber)]
      && queryParams[this.getURLFullParamKey(StorageKeyEnum.End, personNumber)]
      && queryParams[this.getURLFullParamKey(StorageKeyEnum.WorkDays, personNumber)]
      );
  }

  getUserSelectionFromURL(personNumber: number): UserSelection {

    let queryParams = this.activatedRoute.snapshot.queryParams;

    let userSelection: UserSelection = new UserSelection(personNumber);

    let nameQP = queryParams[this.getURLFullParamKey(StorageKeyEnum.Name, personNumber)];
    let rateQP = queryParams[this.getURLFullParamKey(StorageKeyEnum.Rate, personNumber)];
    let frequencyQP = queryParams[this.getURLFullParamKey(StorageKeyEnum.Frequency, personNumber)];
    let currencyQP = queryParams[this.getURLFullParamKey(StorageKeyEnum.Currency, personNumber)];
    let startQP = queryParams[this.getURLFullParamKey(StorageKeyEnum.Start, personNumber)];
    let endQP = queryParams[this.getURLFullParamKey(StorageKeyEnum.End, personNumber)];
    let workDaysQP = queryParams[this.getURLFullParamKey(StorageKeyEnum.WorkDays, personNumber)];

    if (nameQP) {
      userSelection.name = nameQP;
    }
    if (rateQP && !isNaN(rateQP) && rateQP > 0) {
      userSelection.rate = rateQP;
    }
    if (frequencyQP) {
      let indexOnArray = AppConstants.Common.FREQUENCIES.map(rf => rf.value).indexOf(frequencyQP);
      if (indexOnArray != -1) {
        userSelection.frequency = AppConstants.Common.FREQUENCIES[indexOnArray];
      }
    }
    if (currencyQP) {
      let indexOnArray = AppConstants.Common.CURRENCY_SYMBOLS.map(cs => cs).indexOf(currencyQP);
      if (indexOnArray != -1) {
        userSelection.currencySymbol = currencyQP;
      }
    }
    if (startQP) {
      if (this.isValidTime(startQP)) {
        userSelection.startTime = startQP;
      }
    }
    if (endQP) {
      if (this.isValidTime(endQP)) {
        userSelection.endTime = endQP;
      }
    }
    if (workDaysQP) {
      userSelection.weekWorkingDays = this.getWorkingDaysFromString(workDaysQP);
    }


    return userSelection;

  }

  setUserSelectionOnURL(userSelection: UserSelection): void {

    let personNumber = userSelection.personNumber;

    let params: any = <any>{};

    params[this.getURLFullParamKey(StorageKeyEnum.Name, personNumber)] = userSelection.name;
    params[this.getURLFullParamKey(StorageKeyEnum.Rate, personNumber)] = userSelection.rate;
    params[this.getURLFullParamKey(StorageKeyEnum.Frequency, personNumber)] = userSelection.frequency.value;
    params[this.getURLFullParamKey(StorageKeyEnum.Currency, personNumber)] = userSelection.currencySymbol;
    params[this.getURLFullParamKey(StorageKeyEnum.Start, personNumber)] = userSelection.startTime;
    params[this.getURLFullParamKey(StorageKeyEnum.End, personNumber)] = userSelection.endTime;
    params[this.getURLFullParamKey(StorageKeyEnum.WorkDays, personNumber)] = this.getWorkingDaysFromArray(userSelection.weekWorkingDays);

    this.router.navigate(['/'], { queryParams: params });
  }

  setUserSelectionsOnURL(userSelections: Array<UserSelection>): void {

    let params: any = <any>{};

    userSelections.forEach((us: UserSelection) => {

      let personNumber = us.personNumber;

      params[this.getURLFullParamKey(StorageKeyEnum.Name, personNumber)] = us.name;
      params[this.getURLFullParamKey(StorageKeyEnum.Rate, personNumber)] = us.rate;
      params[this.getURLFullParamKey(StorageKeyEnum.Frequency, personNumber)] = us.frequency.value;
      params[this.getURLFullParamKey(StorageKeyEnum.Currency, personNumber)] = us.currencySymbol;
      params[this.getURLFullParamKey(StorageKeyEnum.Start, personNumber)] = us.startTime;
      params[this.getURLFullParamKey(StorageKeyEnum.End, personNumber)] = us.endTime;
      params[this.getURLFullParamKey(StorageKeyEnum.WorkDays, personNumber)] = this.getWorkingDaysFromArray(us.weekWorkingDays);

    });

    this.router.navigate(['/compare'], { queryParams: params });
  }

  private isValidTime(text: string): boolean {
    let result = false;

    if (text.length === 5) {
      let hours = +text.substring(0, 2);
      let separator = text.substring(2, 3);
      let minutes = +text.substring(3, 5);

      if (separator === ":" && !isNaN(hours) && !isNaN(minutes)) {
        if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
          result = true;
        }
      }

    }

    return result;
  }

  private getWorkingDaysFromString(workDaysText: string): Array<boolean> {

    let result: boolean[] = new Array<boolean>();
    result[WeekDaysEnum.Sunday] = false;
    result[WeekDaysEnum.Monday] = false;
    result[WeekDaysEnum.Tuesday] = false;
    result[WeekDaysEnum.Wednesday] = false;
    result[WeekDaysEnum.Thursday] = false;
    result[WeekDaysEnum.Friday] = false;
    result[WeekDaysEnum.Saturday] = false;

    workDaysText.split(',').forEach((wd) => {
      let wdNumber: number = Number(wd);
      if (!isNaN(wdNumber) && wdNumber >= 0 && wdNumber <= 6) {
        result[wdNumber] = true;
      }
    });

    return result;
  }

  private getWorkingDaysFromArray(workDaysArray: Array<boolean>): string {

    let workDaysIndexes: number[] = new Array<number>();
    workDaysArray.forEach((wd, index) => {
      if (wd === true) {
        workDaysIndexes.push(index);
      }
    });
    return workDaysIndexes.join(',');
  }

}
