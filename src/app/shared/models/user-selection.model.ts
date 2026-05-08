import { AppConstants } from '../constants/app.constant';
import { PeriodEnum } from '../enums/period.enum';
import { INameValue } from '../interfaces/name-value.interface';
import { CurrencyHelper } from '../utils/currency-helper';
import { DateHelper } from '../utils/date-helper';
import { LanguageHelper } from '../utils/language-helper';
import { TranslationHelper } from '../utils/translation-helper';

interface DateRange {
  start: Date;
  end: Date;
}

export class UserSelection {
  private static readonly NO_WORKING_DAYS = [false, false, false, false, false, false, false];
  private static readonly DEFAULT_WORKING_DAYS = [false, true, true, true, true, true, false];

  personNumber: number = null;
  name: string = null;
  rate: number = null;
  startTime: string = null;
  endTime: string = null;
  currencySymbol: string = null;
  frequency: INameValue = null;
  weekWorkingDays: boolean[];

  dayStartTime: Date = null;
  dayEndTime: Date = null;

  dateTimeWhenClickedCalculate: Date = null;

  workingHoursToday: number = null;
  workingHoursThisHour: number = null;
  workingDaysThisWeek: number = null;
  workingDaysThisMonth: number = null;
  workingDaysThisYear: number = null;
  workingHoursThisWeek: number = null;
  workingHoursThisMonth: number = null;
  workingHoursThisYear: number = null;

  stopwatchAmount: number = null;
  currentHourAmount: number = null;
  currentDayAmount: number = null;
  currentWeekAmount: number = null;
  currentMonthAmount: number = null;
  currentYearAmount: number = null;

  totalHourAmount: number = null;
  totalDayAmount: number = null;
  totalWeekAmount: number = null;
  totalMonthAmount: number = null;
  totalYearAmount: number = null;

  totalDayAmountWhenNotOff: number = null;
  totalHourAmountWhenNotOff: number = null;

  updateAmountsIntervalId: number = null;

  constructor(personNumber: number) {
    this.personNumber = personNumber;

    if (personNumber === 1) {
      this.name = AppConstants.Common.FIRST_USER_DEFAULT_NAME;
    } else {
      this.name = `${$localize`:@@user-selection-model.person:Person`} ${personNumber}`;
    }

    this.weekWorkingDays = [...UserSelection.NO_WORKING_DAYS];
  }

  private buildStartAndEndTimeDates(now: Date): void {
    this.dayStartTime = DateHelper.buildDate(now, this.startTime);
    this.dayEndTime = DateHelper.buildDate(now, this.endTime);

    if (this.endTime < this.startTime && this.endTime === '00:00') {
      this.dayStartTime = DateHelper.addMilliseconds(this.dayStartTime, -1);
      this.dayEndTime = DateHelper.getDateAtOneMillisecondBeforeEndOfDay(now);
    }
  }

  calculate(): void {
    this.clearInterval();

    this.dateTimeWhenClickedCalculate = new Date();
    const workingDaysArray = this.getWeekWorkingDaysArray();

    const updateAmounts = (): void => {
      // Keep this inside the interval so dates stay correct when the day changes.
      const now: Date = new Date();
      this.buildStartAndEndTimeDates(now);

      this.workingHoursToday = DateHelper.hoursBetweenDates(this.dayStartTime, this.dayEndTime);

      this.workingHoursThisHour = this.getWorkingHoursThisHour(now);

      this.workingDaysThisWeek = workingDaysArray.length;
      this.workingDaysThisMonth = DateHelper.getDaysWorkedInPeriod(
        workingDaysArray,
        DateHelper.getFirstDayOfCurrentMonth(now),
        DateHelper.getLastDayOfCurrentMonth(now),
      );
      this.workingDaysThisYear = DateHelper.getDaysWorkedInPeriod(
        workingDaysArray,
        DateHelper.getFirstDayOfCurrentYear(now),
        DateHelper.getLastDayOfCurrentYear(now),
      );

      this.workingHoursThisWeek = this.workingDaysThisWeek * this.workingHoursToday;
      this.workingHoursThisMonth = this.workingDaysThisMonth * this.workingHoursToday;
      this.workingHoursThisYear = this.workingDaysThisYear * this.workingHoursToday;

      this.updateTotalAmounts(now);

      this.updateCurrentAmounts(now);
    };

    updateAmounts();
    this.updateAmountsIntervalId = window.setInterval(
      updateAmounts,
      AppConstants.Common.UPDATE_AMOUNTS_FREQUENCY_IN_MS,
    );
  }

  private getWorkingHoursThisHour(now: Date): number {
    if (this.hasDayOff(now) || !this.isWorkingAtSomePointDuringCurrentHour(now)) {
      return 0;
    }

    const currentHourStartAndEndDates = this.getCurrentHourStartAndEndDates(now);

    return DateHelper.hoursBetweenDates(
      currentHourStartAndEndDates.start,
      currentHourStartAndEndDates.end,
    );
  }

  private getTotalHourAmount(now: Date, hoursPercentage: number): number {
    if (this.frequency.value === 'hour') {
      return (hoursPercentage * this.totalHourAmountWhenNotOff) / 100;
    } else {
      if (!this.isWorkingAtSomePointDuringCurrentHour(now)) {
        return 0;
      } else if (
        this.workingHoursToday < 1 &&
        this.dayStartTime.getHours() === DateHelper.addMilliseconds(this.dayEndTime, -1).getHours()
      ) {
        return this.totalDayAmountWhenNotOff;
      } else {
        return (hoursPercentage * this.totalHourAmountWhenNotOff) / 100;
      }
    }
  }

  private updateTotalAmounts(now: Date): void {
    const hoursPercentage = (this.workingHoursThisHour / 1) * 100;

    switch (this.frequency.value) {
      case 'hour':
        this.totalDayAmountWhenNotOff = +this.rate * this.workingHoursToday;
        this.totalHourAmountWhenNotOff = +this.rate;

        this.totalHourAmount = this.getTotalHourAmount(now, hoursPercentage);

        this.totalDayAmount = this.hasDayOff(now) ? 0 : this.totalDayAmountWhenNotOff;
        this.totalWeekAmount = +this.rate * this.workingHoursThisWeek;
        this.totalMonthAmount = +this.rate * this.workingHoursThisMonth;
        this.totalYearAmount = +this.rate * this.workingHoursThisYear;
        break;
      case 'day':
        this.totalDayAmountWhenNotOff = +this.rate;
        this.totalHourAmountWhenNotOff =
          this.workingHoursToday > 1
            ? this.totalDayAmountWhenNotOff / this.workingHoursToday
            : this.totalDayAmountWhenNotOff * this.workingHoursToday;

        this.totalHourAmount = this.getTotalHourAmount(now, hoursPercentage);

        this.totalDayAmount = this.hasDayOff(now) ? 0 : this.totalDayAmountWhenNotOff;
        this.totalWeekAmount = +this.rate * this.workingDaysThisWeek;
        this.totalMonthAmount = +this.rate * this.workingDaysThisMonth;
        this.totalYearAmount = +this.rate * this.workingDaysThisYear;

        break;
      case 'week':
        this.totalDayAmountWhenNotOff = +this.rate / this.workingDaysThisWeek;
        this.totalHourAmountWhenNotOff =
          this.workingHoursToday > 1
            ? this.totalDayAmountWhenNotOff / this.workingHoursToday
            : this.totalDayAmountWhenNotOff * this.workingHoursToday;

        this.totalHourAmount = this.getTotalHourAmount(now, hoursPercentage);

        this.totalDayAmount = this.hasDayOff(now) ? 0 : this.totalDayAmountWhenNotOff;
        this.totalWeekAmount = +this.rate;
        this.totalMonthAmount = this.totalDayAmountWhenNotOff * this.workingDaysThisMonth;
        this.totalYearAmount = this.totalDayAmountWhenNotOff * this.workingDaysThisYear;
        break;
      case 'month':
        this.totalMonthAmount = +this.rate;
        this.totalYearAmount = +this.rate * 12;

        this.totalDayAmountWhenNotOff = this.totalMonthAmount / this.workingDaysThisMonth;
        this.totalHourAmountWhenNotOff =
          this.workingHoursToday > 1
            ? this.totalDayAmountWhenNotOff / this.workingHoursToday
            : this.totalDayAmountWhenNotOff * this.workingHoursToday;

        this.totalHourAmount = this.getTotalHourAmount(now, hoursPercentage);

        this.totalDayAmount = this.hasDayOff(now) ? 0 : this.totalDayAmountWhenNotOff;
        this.totalWeekAmount = this.workingDaysThisWeek * this.totalDayAmountWhenNotOff;
        break;
      case 'year':
        this.totalYearAmount = +this.rate;
        this.totalMonthAmount = +this.rate / 12;

        this.totalDayAmountWhenNotOff = this.totalMonthAmount / this.workingDaysThisMonth;
        this.totalHourAmountWhenNotOff =
          this.workingHoursToday > 1
            ? this.totalDayAmountWhenNotOff / this.workingHoursToday
            : this.totalDayAmountWhenNotOff * this.workingHoursToday;

        this.totalHourAmount = this.getTotalHourAmount(now, hoursPercentage);

        this.totalDayAmount = this.hasDayOff(now) ? 0 : this.totalDayAmountWhenNotOff;
        this.totalWeekAmount = this.workingDaysThisWeek * this.totalDayAmountWhenNotOff;
        break;
    }
  }

  private updateCurrentAmounts(now: Date): void {
    const amountEarnedToday = this.getAmountEarnedToday(now);

    this.updateStopwatchAmount(now);
    this.updateCurrentHourAmount(now);
    this.updateCurrentDayAmount(amountEarnedToday);
    this.updateCurrentWeekAmount(now, amountEarnedToday);
    this.updateCurrentMonthAmount(now, amountEarnedToday);
    this.updateCurrentYearAmount(now, amountEarnedToday);
  }

  private updateStopwatchAmount(now: Date): void {
    let hoursWorkedSinceClickedCalculate = 0;
    if (
      !this.hasDayOff(now) &&
      this.workTodayHasStarted(now) &&
      this.dateTimeWhenClickedCalculate < this.dayEndTime
    ) {
      hoursWorkedSinceClickedCalculate = DateHelper.hoursBetweenDates(
        DateHelper.maxDate(this.dateTimeWhenClickedCalculate, this.dayStartTime),
        DateHelper.minDate(now, this.dayEndTime),
      );
    }

    const earnedToday = hoursWorkedSinceClickedCalculate * this.totalHourAmountWhenNotOff;

    this.stopwatchAmount = earnedToday;
  }
  private updateCurrentHourAmount(now: Date): void {
    this.currentHourAmount = this.getAmountEarnedThisHour(now);
  }

  private updateCurrentDayAmount(amountEarnedToday: number): void {
    this.currentDayAmount = amountEarnedToday;
  }

  private updateCurrentWeekAmount(now: Date, amountEarnedToday: number): void {
    const startPeriod = DateHelper.getMondayOfCurrentWeek(now);
    startPeriod.setHours(0, 0, 0, 0);

    const earnedUntilYesterday = this.getAmountEarnedUntilYesterday(
      PeriodEnum.CurrentWeek,
      startPeriod,
      now,
    );

    this.currentWeekAmount = earnedUntilYesterday + amountEarnedToday;
  }

  private updateCurrentMonthAmount(now: Date, amountEarnedToday: number): void {
    const startPeriod = DateHelper.getFirstDayOfCurrentMonth(now);

    const earnedUntilYesterday = this.getAmountEarnedUntilYesterday(
      PeriodEnum.CurrentMonth,
      startPeriod,
      now,
    );

    this.currentMonthAmount = earnedUntilYesterday + amountEarnedToday;
  }

  private updateCurrentYearAmount(now: Date, amountEarnedToday: number): void {
    const startPeriod = DateHelper.getFirstDayOfCurrentYear(now);

    const earnedUntilYesterday = this.getAmountEarnedUntilYesterday(
      PeriodEnum.CurrentYear,
      startPeriod,
      now,
    );

    this.currentYearAmount = earnedUntilYesterday + amountEarnedToday;
  }

  private isWorkingAtSomePointDuringCurrentHour(now: Date): boolean {
    return (
      !this.hasDayOff(now) &&
      this.dayStartTime.getHours() <= now.getHours() &&
      DateHelper.addMilliseconds(this.dayEndTime, -1).getHours() >= now.getHours()
    );
  }

  private getCurrentHourStartAndEndDates(now: Date): DateRange {
    const start: Date = new Date(now);

    const currentHourStartMinutes =
      this.dayStartTime.getHours() === now.getHours() ? this.dayStartTime.getMinutes() : 0;

    start.setHours(now.getHours(), currentHourStartMinutes, 0, 0);

    const end: Date = new Date(now);

    if (this.dayEndTime.getHours() === now.getHours()) {
      end.setHours(now.getHours(), this.dayEndTime.getMinutes(), 0, 0);
    } else {
      end.setHours(now.getHours() + 1, 0, 0, 0);
    }

    return {
      start,
      end,
    };
  }

  private getAmountEarnedThisHour(now: Date): number {
    let earnedThisHour: number = 0;

    if (this.workTodayHasStarted(now) && this.isWorkingAtSomePointDuringCurrentHour(now)) {
      const currentHourStartAndEndDates = this.getCurrentHourStartAndEndDates(now);

      const timeWorkedDuringCurrentHourInHours = DateHelper.hoursBetweenDates(
        currentHourStartAndEndDates.start,
        DateHelper.minDate(now, currentHourStartAndEndDates.end),
      );

      const totalTimeThatShouldWorkThisHourInHours = DateHelper.hoursBetweenDates(
        currentHourStartAndEndDates.start,
        currentHourStartAndEndDates.end,
      );

      const percentageCompleted =
        (timeWorkedDuringCurrentHourInHours / totalTimeThatShouldWorkThisHourInHours) * 100;

      earnedThisHour = (percentageCompleted * this.totalHourAmount) / 100;
    }

    return earnedThisHour;
  }

  private getAmountEarnedToday(now: Date): number {
    let earnedToday: number = 0;

    if (this.workTodayHasStarted(now)) {
      const hoursWorkedToday = this.getNumberOfHoursWorkedToday(now);
      const percentageCompleted = (hoursWorkedToday / this.workingHoursToday) * 100;
      earnedToday = (percentageCompleted * this.totalDayAmountWhenNotOff) / 100;
    }

    return earnedToday;
  }

  private getAmountEarnedUntilYesterday(
    periodType: PeriodEnum,
    startPeriod: Date,
    now: Date,
  ): number {
    if (
      periodType === PeriodEnum.CurrentYear &&
      (this.frequency.value === 'year' || this.frequency.value === 'month')
    ) {
      const monthsWorkedInFull = now.getMonth(); //getMonth() is 0 index.
      const firstdayOfCurrentMonth = DateHelper.getFirstDayOfCurrentMonth(now);
      const daysWorkedThisMonthUntilYesterday = this.getNumberOfDaysWorkedUntilYesterday(
        PeriodEnum.CurrentMonth,
        firstdayOfCurrentMonth,
        now,
      );

      return (
        monthsWorkedInFull * this.totalMonthAmount +
        daysWorkedThisMonthUntilYesterday * this.totalDayAmountWhenNotOff
      );
    }

    const daysWorkedUntilYesterday = this.getNumberOfDaysWorkedUntilYesterday(
      periodType,
      startPeriod,
      now,
    );
    return daysWorkedUntilYesterday * this.totalDayAmountWhenNotOff;
  }

  private getNumberOfDaysWorkedUntilYesterday(
    periodType: PeriodEnum,
    startPeriod: Date,
    now: Date,
  ): number {
    const yesterday = DateHelper.addDays(now, -1);
    yesterday.setHours(0, 0, 0, 0);

    let result: number = 0;

    switch (periodType) {
      case PeriodEnum.Stopwatch:
      case PeriodEnum.CurrentHour:
      case PeriodEnum.CurrentDay:
        result = 0;
        break;
      case PeriodEnum.CurrentWeek:
        if (!DateHelper.isMonday(now)) {
          result = DateHelper.getDaysWorkedInPeriod(
            this.getWeekWorkingDaysArray(),
            startPeriod,
            yesterday,
          );
        }
        break;
      case PeriodEnum.CurrentMonth:
        if (!DateHelper.isFirstDayOfTheMonth(now)) {
          result = DateHelper.getDaysWorkedInPeriod(
            this.getWeekWorkingDaysArray(),
            startPeriod,
            yesterday,
          );
        }
        break;
      case PeriodEnum.CurrentYear:
        if (!DateHelper.isFirstDayOfTheYear(now)) {
          result = DateHelper.getDaysWorkedInPeriod(
            this.getWeekWorkingDaysArray(),
            startPeriod,
            yesterday,
          );
        }
        break;
    }

    return result;
  }

  private getNumberOfHoursWorkedToday(now: Date): number {
    let hoursWorkedToday = 0;

    if (!this.hasDayOff(now) && this.workTodayHasStarted(now)) {
      hoursWorkedToday = DateHelper.hoursBetweenDates(
        this.dayStartTime,
        DateHelper.minDate(now, this.dayEndTime),
      );
    }

    return hoursWorkedToday;
  }

  hasDayOff(date: Date = new Date()): boolean {
    return !this.weekWorkingDays[date.getDay()];
  }

  private getWeekWorkingDaysArray(): number[] {
    const result: number[] = [];

    for (let index = 0; index < this.weekWorkingDays.length; index++) {
      if (this.weekWorkingDays[index]) {
        result.push(index);
      }
    }

    return result;
  }

  canCalculate(): boolean {
    return Boolean(
      this.hasName() &&
      this.hasRate() &&
      this.currencySymbol &&
      this.frequency &&
      this.isAtLeastOneDayOfTheWeekSelected() &&
      this.areStartAndEndTimesValid(),
    );
  }

  hasName(): boolean {
    return Boolean(this.name && this.name.trim() !== '');
  }

  hasRate(): boolean {
    return Number.isFinite(this.rate) && this.rate > 0;
  }

  isAtLeastOneDayOfTheWeekSelected(): boolean {
    return this.weekWorkingDays.includes(true);
  }

  areStartAndEndTimesValid(): boolean {
    return Boolean(
      this.startTime &&
      this.endTime &&
      (this.endTime > this.startTime ||
        (this.endTime < this.startTime && this.endTime === '00:00')),
    );
  }

  getRemainingTimeToStartWork(): string {
    const now = new Date();

    const hasDayOffToday = this.hasDayOff(now);
    const workTodayHasStarted = this.workTodayHasStarted(now);
    const workTodayHasFinished = this.workTodayHasFinished(now);

    if (!hasDayOffToday && !workTodayHasStarted) {
      return `${$localize`:@@user-selection-model.you-start-work-in:You start work in`} ${DateHelper.getFormattedTimeBetweenDatesVerbose(now, this.dayStartTime)}`;
    } else if ((!hasDayOffToday && workTodayHasFinished) || hasDayOffToday) {
      const tomorrow = DateHelper.addDays(now, 1);
      const nextWorkingDayStartTime = this.getNextWorkingDay(now);
      const nextWorkingDayNumber = nextWorkingDayStartTime.getDay();
      const nextWorkingDayName = TranslationHelper.translateDayOfTheWeek(nextWorkingDayNumber);

      if (this.hasDayOff(tomorrow)) {
        return `${$localize`:@@user-selection-model.you-are-off-until-next:You're off until`} ${nextWorkingDayName} ${$localize`:@@user-selection-model.at:at`} ${this.startTime}`;
      } else {
        const secondsUntilStartWorking = DateHelper.secondsBetweenDates(
          now,
          nextWorkingDayStartTime,
        );
        const oneFullDayInSeconds = 24 * 60 * 60;

        if (secondsUntilStartWorking > oneFullDayInSeconds) {
          return `${$localize`:@@user-selection-model.you-start-work-tomorrow-at:You start work tomorrow at`} ${this.startTime}`;
        } else {
          return `${$localize`:@@user-selection-model.you-start-work-in:You start work in`} ${DateHelper.getFormattedTimeBetweenDatesVerbose(now, nextWorkingDayStartTime)}`;
        }
      }
    } else {
      // Should not ever reach this point.
      return '';
    }
  }

  private getNextWorkingDay(date: Date): Date {
    let dayOfTheWeek = this.weekWorkingDays.indexOf(true, date.getDay() + 1);
    if (dayOfTheWeek === -1) {
      dayOfTheWeek = this.weekWorkingDays.indexOf(true, 0);
    }

    const resultDate = DateHelper.getNextDayOfWeek(date, dayOfTheWeek);

    return DateHelper.buildDate(resultDate, this.startTime);
  }

  getRemainingTimeToFinishWork(): string {
    return DateHelper.getFormattedTimeBetweenDatesVerbose(new Date(), this.dayEndTime);
  }

  workTodayHasStarted(now: Date = new Date()): boolean {
    return !this.hasDayOff(now) && now > this.dayStartTime;
  }

  workTodayHasFinished(now: Date = new Date()): boolean {
    return !this.hasDayOff(now) && now > this.dayEndTime;
  }

  isCurrentlyWorking(): boolean {
    const now = new Date();
    return !this.hasDayOff(now) && this.workTodayHasStarted(now) && !this.workTodayHasFinished(now);
  }

  setDefaultValues(
    browserLanguageCodes: readonly (
      | string
      | null
      | undefined
    )[] = LanguageHelper.getBrowserLanguageCodes(),
  ): void {
    this.startTime = '09:00';
    this.endTime = '17:00';
    this.currencySymbol = CurrencyHelper.getPreferredCurrencySymbol(browserLanguageCodes);
    this.frequency = AppConstants.Common.FREQUENCIES[3];

    this.weekWorkingDays = [...UserSelection.DEFAULT_WORKING_DAYS];
  }

  clearResults(): void {
    this.clearInterval();

    this.stopwatchAmount = null;
    this.currentHourAmount = null;
    this.currentDayAmount = null;
    this.currentWeekAmount = null;
    this.currentMonthAmount = null;
    this.currentYearAmount = null;

    this.totalHourAmount = null;
    this.totalDayAmount = null;
    this.totalWeekAmount = null;
    this.totalMonthAmount = null;
    this.totalYearAmount = null;
  }

  private clearInterval(): void {
    if (this.updateAmountsIntervalId) {
      clearInterval(this.updateAmountsIntervalId);
      this.updateAmountsIntervalId = null;
    }
  }
}
