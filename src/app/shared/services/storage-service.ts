import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserSelection } from '../models/user-selection.model';
import { AppConstants } from '../constants/app-constants';
import { ActivatedRoute, Router } from '@angular/router';
import { WeekDaysEnum } from '../enums/week-days.enum';


@Injectable({
  providedIn: 'root'
})

export class StorageService {

  private readonly localStoragePrefix = environment.localStoragePrefix;


  constructor(private activatedRoute: ActivatedRoute, private router: Router) {

  }

  hasUserSelectionOnLocalStorage(personNumber: number = null): boolean {

    return (localStorage[`${this.localStoragePrefix}rate${personNumber}`]
      && localStorage[`${this.localStoragePrefix}frequency${personNumber}`]
      && localStorage[`${this.localStoragePrefix}currency${personNumber}`]
      && localStorage[`${this.localStoragePrefix}start${personNumber}`]
      && localStorage[`${this.localStoragePrefix}end${personNumber}`]
      && localStorage[`${this.localStoragePrefix}workdays${personNumber}`]);
  }

  getUserSelectionFromLocalStorage(personNumber: number = null): UserSelection {

    let userSelection: UserSelection = new UserSelection(personNumber);

    userSelection.rate = localStorage[`${this.localStoragePrefix}rate${personNumber}`];
    userSelection.currencySymbol = localStorage[`${this.localStoragePrefix}currency${personNumber}`];
    userSelection.startTime = localStorage[`${this.localStoragePrefix}start${personNumber}`];
    userSelection.endTime = localStorage[`${this.localStoragePrefix}end${personNumber}`];

    let indexOnArray = AppConstants.Common.FREQUENCIES.map(rf => rf.value).indexOf(localStorage[`${this.localStoragePrefix}frequency${personNumber}`]);
    if (indexOnArray != -1) {
      userSelection.frequency = AppConstants.Common.FREQUENCIES[indexOnArray];
    }

    let workDays = localStorage[`${this.localStoragePrefix}workdays${personNumber}`];
    userSelection.weekWorkingDays = this.getWorkingDaysFromString(workDays);

    return userSelection;

  }

  saveUserSelectionOnLocalStorage(userSelection: UserSelection): void {

    let personNumber = userSelection.personNumber;

    localStorage[`${this.localStoragePrefix}rate${personNumber}`] = userSelection.rate;
    localStorage[`${this.localStoragePrefix}frequency${personNumber}`] = userSelection.frequency.value;
    localStorage[`${this.localStoragePrefix}currency${personNumber}`] = userSelection.currencySymbol;
    localStorage[`${this.localStoragePrefix}start${personNumber}`] = userSelection.startTime;
    localStorage[`${this.localStoragePrefix}end${personNumber}`] = userSelection.endTime;
    localStorage[`${this.localStoragePrefix}workdays${personNumber}`] = this.getWorkingDaysFromArray(userSelection.weekWorkingDays);
  }

  saveUserSelectionsOnLocalStorage(userSelections: Array<UserSelection>): void {

    this.cleanUserSelectionsOnLocalStorage();

    userSelections.forEach((us: UserSelection) => {
      this.saveUserSelectionOnLocalStorage(us);
    });
  }

  private cleanUserSelectionsOnLocalStorage(): void {

    for (let personNumber = 1; personNumber <= environment.compareToolMaxPersons; personNumber++) {

      localStorage.removeItem(`${this.localStoragePrefix}rate${personNumber}`);
      localStorage.removeItem(`${this.localStoragePrefix}frequency${personNumber}`);
      localStorage.removeItem(`${this.localStoragePrefix}currency${personNumber}`);
      localStorage.removeItem(`${this.localStoragePrefix}start${personNumber}`);
      localStorage.removeItem(`${this.localStoragePrefix}end${personNumber}`);
      localStorage.removeItem(`${this.localStoragePrefix}workdays${personNumber}`);

    }
  }

  hasUserSelectionOnURL(personNumber: number = null): boolean {
    let queryParams = this.activatedRoute.snapshot.queryParams;

    return (queryParams[`rate${personNumber}`]
      && queryParams[`frequency${personNumber}`]
      && queryParams[`currency${personNumber}`]
      && queryParams[`start${personNumber}`]
      && queryParams[`end${personNumber}`]
      && queryParams[`workdays${personNumber}`]);
  }

  getUserSelectionFromURL(personNumber: number = null): UserSelection {

    let queryParams = this.activatedRoute.snapshot.queryParams;

    let userSelection: UserSelection = new UserSelection(personNumber);

    if (this.hasUserSelectionOnURL()) {

      let rateQP = queryParams[`rate${personNumber}`];
      let frequencyQP = queryParams[`frequency${personNumber}`];
      let currencyQP = queryParams[`currency${personNumber}`];
      let startQP = queryParams[`start${personNumber}`];
      let endQP = queryParams[`end${personNumber}`];
      let workDaysQP = queryParams[`workDays${personNumber}`];

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

    }

    return userSelection;

  }

  setUserSelectionOnURL(userSelection: UserSelection): void {

    let personNumber = userSelection.personNumber;

    let params: any = <any>{};

    params[`rate${personNumber}`] = userSelection.rate;
    params[`frequency${personNumber}`] = userSelection.frequency.value;
    params[`currency${personNumber}`] = userSelection.currencySymbol;
    params[`start${personNumber}`] = userSelection.startTime;
    params[`end${personNumber}`] = userSelection.endTime;
    params[`workdays${personNumber}`] = this.getWorkingDaysFromArray(userSelection.weekWorkingDays);

    this.router.navigate(['/'], { queryParams: params });
  }

  setUserSelectionsOnURL(userSelections: Array<UserSelection>): void {

    let params: any = <any>{};

    userSelections.forEach((us: UserSelection) => {

      let personNumber = us.personNumber;

      params[`rate${personNumber}`] = us.rate;
      params[`frequency${personNumber}`] = us.frequency.value;
      params[`currency${personNumber}`] = us.currencySymbol;
      params[`start${personNumber}`] = us.startTime;
      params[`end${personNumber}`] = us.endTime;
      params[`workdays${personNumber}`] = this.getWorkingDaysFromArray(us.weekWorkingDays);

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
