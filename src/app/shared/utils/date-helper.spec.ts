import '@angular/localize/init';
import { describe, expect, it } from 'vitest';
import { DateHelper } from './date-helper';

describe('DateHelper', () => {
  it('gets absolute time differences', () => {
    const earlier = new Date(2026, 4, 7, 10, 0, 0);
    const later = new Date(2026, 4, 7, 12, 30, 0);

    expect(DateHelper.millisecondsBetweenDates(earlier, later)).toBe(9_000_000);
    expect(DateHelper.secondsBetweenDates(later, earlier)).toBe(9_000);
    expect(DateHelper.hoursBetweenDates(earlier, later)).toBe(2.5);
  });

  it('builds a date with the provided time on the same calendar day', () => {
    const date = new Date(2026, 4, 7, 1, 2, 3, 4);
    const result = DateHelper.buildDate(date, '09:45');

    expect(result).toEqual(new Date(2026, 4, 7, 9, 45, 0, 0));
    expect(date).toEqual(new Date(2026, 4, 7, 1, 2, 3, 4));
  });

  it('counts worked calendar days inclusively', () => {
    const friday = new Date(2026, 2, 27);
    const monday = new Date(2026, 2, 30);

    expect(DateHelper.getDaysWorkedInPeriod([1, 2, 3, 4, 5], friday, monday)).toBe(2);
  });

  it('ignores duplicate and invalid working days', () => {
    const friday = new Date(2026, 2, 27);
    const monday = new Date(2026, 2, 30);

    expect(DateHelper.getDaysWorkedInPeriod([-1, 1, 1, 5, 9], friday, monday)).toBe(2);
  });

  it('ignores time of day when counting worked days', () => {
    const fridayNight = new Date(2026, 2, 27, 23, 59, 59);
    const mondayMorning = new Date(2026, 2, 30, 0, 0, 1);

    expect(DateHelper.getDaysWorkedInPeriod([1, 2, 3, 4, 5], fridayNight, mondayMorning)).toBe(2);
  });

  it('returns zero for reversed periods', () => {
    const start = new Date(2026, 4, 2);
    const end = new Date(2026, 4, 1);

    expect(DateHelper.getDaysWorkedInPeriod([1, 2, 3, 4, 5], start, end)).toBe(0);
  });

  it('adds calendar days and preserves the time', () => {
    const date = new Date(2026, 0, 31, 9, 10, 11, 12);

    expect(DateHelper.addDays(date, 1)).toEqual(new Date(2026, 1, 1, 9, 10, 11, 12));
  });

  it('adds milliseconds across day boundaries', () => {
    const date = new Date(2026, 4, 7, 0, 0, 0, 0);

    expect(DateHelper.addMilliseconds(date, -1)).toEqual(new Date(2026, 4, 6, 23, 59, 59, 999));
  });

  it('gets one millisecond before end of day', () => {
    const date = new Date(2026, 4, 7, 10, 20, 30, 40);

    expect(DateHelper.getDateAtOneMillisecondBeforeEndOfDay(date)).toEqual(
      new Date(2026, 4, 7, 23, 59, 59, 999),
    );
  });

  it('gets the next requested week day and skips today', () => {
    const monday = new Date(2026, 4, 4, 9, 0, 0);

    expect(DateHelper.getNextDayOfWeek(monday, 1)).toEqual(new Date(2026, 4, 11, 9, 0, 0));
    expect(DateHelper.getNextDayOfWeek(monday, 3)).toEqual(new Date(2026, 4, 6, 9, 0, 0));
  });

  it('returns a copy when next week day input is invalid', () => {
    const monday = new Date(2026, 4, 4, 9, 0, 0);
    const result = DateHelper.getNextDayOfWeek(monday, 8);

    expect(result).toEqual(monday);
    expect(result).not.toBe(monday);
  });

  it('gets period boundary dates', () => {
    const date = new Date(2026, 4, 7, 10, 20, 30, 40);

    expect(DateHelper.getMondayOfCurrentWeek(date)).toEqual(new Date(2026, 4, 4, 10, 20, 30, 40));
    expect(DateHelper.getFirstDayOfCurrentMonth(date)).toEqual(new Date(2026, 4, 1, 0, 0, 0, 0));
    expect(DateHelper.getLastDayOfCurrentMonth(date)).toEqual(new Date(2026, 4, 31, 0, 0, 0, 0));
    expect(DateHelper.getFirstDayOfCurrentYear(date)).toEqual(new Date(2026, 0, 1, 0, 0, 0, 0));
    expect(DateHelper.getLastDayOfCurrentYear(date)).toEqual(new Date(2026, 11, 31, 0, 0, 0, 0));
  });

  it('checks common calendar boundaries', () => {
    expect(DateHelper.isMonday(new Date(2026, 4, 4))).toBe(true);
    expect(DateHelper.isMonday(new Date(2026, 4, 5))).toBe(false);
    expect(DateHelper.isFirstDayOfTheMonth(new Date(2026, 4, 1))).toBe(true);
    expect(DateHelper.isFirstDayOfTheYear(new Date(2026, 0, 1))).toBe(true);
  });

  it('gets min and max dates', () => {
    const earlier = new Date(2026, 4, 7);
    const later = new Date(2026, 4, 8);

    expect(DateHelper.minDate(earlier, later)).toBe(earlier);
    expect(DateHelper.maxDate(earlier, later)).toBe(later);
  });

  it('formats elapsed time without an empty hour prefix', () => {
    const from = new Date(2026, 4, 7, 10, 0, 0);
    const to = new Date(2026, 4, 7, 10, 1, 5);

    expect(DateHelper.getFormattedTimeBetweenDates(from, to)).toBe('01:05');
  });

  it('formats elapsed time with hours', () => {
    const from = new Date(2026, 4, 7, 10, 0, 0);
    const to = new Date(2026, 4, 7, 11, 2, 3);

    expect(DateHelper.getFormattedTimeBetweenDates(from, to)).toBe('1:02:03');
  });

  it('formats verbose elapsed time without trailing spaces', () => {
    const from = new Date(2026, 4, 7, 10, 0, 0);

    expect(
      DateHelper.getFormattedTimeBetweenDatesVerbose(from, new Date(2026, 4, 7, 10, 0, 0, 1)),
    ).toBe('1 second');
    expect(
      DateHelper.getFormattedTimeBetweenDatesVerbose(from, new Date(2026, 4, 7, 10, 1, 0)),
    ).toBe('1 minute');
    expect(
      DateHelper.getFormattedTimeBetweenDatesVerbose(from, new Date(2026, 4, 7, 12, 3, 0)),
    ).toBe('2 hours 3 minutes');
  });
});
