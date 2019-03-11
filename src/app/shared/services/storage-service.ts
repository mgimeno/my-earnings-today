import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserSelection } from '../models/user-selection.model';
import { AppConstants } from '../constants/app-constants';
import { ActivatedRoute, Router } from '@angular/router';
import { WeekDaysEnum } from '../enums/week-days.enum';


@Injectable({
  providedIn: 'root'
})

export class StorageService  {

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    
  }

  hasUserSelectionOnLocalStorage(): boolean {
    
    let prefix = environment.localStoragePrefix;

    return (localStorage[`${prefix}rate`]
      && localStorage[`${prefix}frequency`]
      && localStorage[`${prefix}currency`]
      && localStorage[`${prefix}start`]
      && localStorage[`${prefix}end`]
      && localStorage[`${prefix}workdays`]);
  }

  getUserSelectionFromLocalStorage(): UserSelection {
    let prefix = environment.localStoragePrefix;

    let userSelection: UserSelection = new UserSelection();

    userSelection.rate = localStorage[`${prefix}rate`];
    userSelection.currencySymbol = localStorage[`${prefix}currency`];
    userSelection.startTime = localStorage[`${prefix}start`];
    userSelection.endTime = localStorage[`${prefix}end`];

    let indexOnArray = AppConstants.Common.FREQUENCIES.map(rf => rf.value).indexOf(localStorage[`${prefix}frequency`]);
    if (indexOnArray != -1) {
      userSelection.frequency = AppConstants.Common.FREQUENCIES[indexOnArray];
    }

    let workDays = localStorage[`${prefix}workdays`];
    userSelection.weekWorkingDays = this.getWorkingDaysFromString(workDays);

    return userSelection;

  }

  saveUserSelectionOnLocalStorage(userSelection: UserSelection): void {
    let prefix = environment.localStoragePrefix;

    localStorage[`${prefix}rate`] = userSelection.rate;
    localStorage[`${prefix}frequency`] = userSelection.frequency.value;
    localStorage[`${prefix}currency`] = userSelection.currencySymbol;
    localStorage[`${prefix}start`] = userSelection.startTime;
    localStorage[`${prefix}end`] = userSelection.endTime;
    localStorage[`${prefix}workdays`] = this.getWorkingDaysFromArray(userSelection.weekWorkingDays);
  }

  hasUserSelectionOnURL(): boolean {
    let queryParams = this.activatedRoute.snapshot.queryParams;

    return (queryParams.rate
      && queryParams.frequency
      && queryParams.currency
      && queryParams.start
      && queryParams.end
      && queryParams.workdays);
  }

  getUserSelectionFromURL(): UserSelection {

    let queryParams = this.activatedRoute.snapshot.queryParams;

    let userSelection: UserSelection = new UserSelection();

    if (this.hasUserSelectionOnURL()) {

      if (queryParams.rate && !isNaN(queryParams.rate) && queryParams.rate > 0) {
        userSelection.rate = queryParams.rate;
      }
      if (queryParams.frequency) {
        let indexOnArray = AppConstants.Common.FREQUENCIES.map(rf => rf.value).indexOf(queryParams.frequency);
        if (indexOnArray != -1) {
          userSelection.frequency = AppConstants.Common.FREQUENCIES[indexOnArray];
        }
      }
      if (queryParams.currency) {
        let indexOnArray = AppConstants.Common.CURRENCY_SYMBOLS.map(cs => cs).indexOf(queryParams.currency);
        if (indexOnArray != -1) {
          userSelection.currencySymbol = queryParams.currency;
        }
      }
      if (queryParams.start) {
        if (this.isValidTime(queryParams.start)) {
          userSelection.startTime = queryParams.start;
        }
      }
      if (queryParams.end) {
        if (this.isValidTime(queryParams.end)) {
          userSelection.endTime = queryParams.end;
        }
      }
      if (queryParams.workdays) {
        userSelection.weekWorkingDays = this.getWorkingDaysFromString(queryParams.workdays);
      }

      if (userSelection.canCalculate()) {
        userSelection.calculate();
      }

    }

    return userSelection;

  }

  setUserSelectionOnURL(userSelection: UserSelection): void {

    let params = {
      rate: userSelection.rate,
      frequency: userSelection.frequency.value,
      currency: userSelection.currencySymbol,
      start: userSelection.startTime,
      end: userSelection.endTime,
      workdays: this.getWorkingDaysFromArray(userSelection.weekWorkingDays)
    };

    this.router.navigate(['.'], { queryParams: params });
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
      if (!isNaN(wdNumber)) {
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