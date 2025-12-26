/**
 * Class DateTime for working with dates and timezones
 * Wrapper over dayjs with timezone support
 */
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import type { IDateTime, DateTimeOptions, Input, IDateTimeFactory } from './types';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(quarterOfYear);

export type TimeUnit = 's' | 'm' | 'h' | 'd' | 'w' | 'M' | 'Q' | 'y';

// Mapping short units to dayjs ManipulateType
const unitMap: Record<TimeUnit, dayjs.ManipulateType | 'quarter'> = {
    s: 'second',
    m: 'minute',
    h: 'hour',
    d: 'day',
    w: 'week',
    M: 'month',
    Q: 'quarter',
    y: 'year',
};

/**
 * Immutable DateTime class with timezone support
 */
class DateTime implements IDateTime {
    private _date: dayjs.Dayjs;
    private _timeZone?: string;

    constructor(input?: Input, options?: DateTimeOptions) {
        const { timeZone } = options ?? {};
        this._timeZone = timeZone;

        if (dayjs.isDayjs(input)) {
            this._date = input;
        } else if (input === undefined) {
            this._date = timeZone ? dayjs().tz(timeZone) : dayjs();
        } else {
            this._date = timeZone ? dayjs(input).tz(timeZone) : dayjs(input);
        }
    }

    /**
     * Adds time
     */
    add(amount: number, unit: TimeUnit): DateTime {
        const dayjsUnit = unitMap[unit] as dayjs.ManipulateType;
        const newDate = this._date.add(amount, dayjsUnit);

        return new DateTime(newDate, { timeZone: this._timeZone });
    }

    /**
     * Subtracts time
     */
    subtract(amount: number, unit: TimeUnit): DateTime {
        const dayjsUnit = unitMap[unit] as dayjs.ManipulateType;
        const newDate = this._date.subtract(amount, dayjsUnit);

        return new DateTime(newDate, { timeZone: this._timeZone });
    }

    /**
     * Rounds to the start of the period
     */
    startOf(unit: TimeUnit): DateTime {
        const dayjsUnit = unitMap[unit] as dayjs.OpUnitType;
        const newDate = this._date.startOf(dayjsUnit);

        return new DateTime(newDate, { timeZone: this._timeZone });
    }

    /**
     * Rounds to the end of the period
     */
    endOf(unit: TimeUnit): DateTime {
        const dayjsUnit = unitMap[unit] as dayjs.OpUnitType;
        const newDate = this._date.endOf(dayjsUnit);

        return new DateTime(newDate, { timeZone: this._timeZone });
    }

    /**
     * Formats the date
     */
    format(formatStr?: string): string {
        return this._date.format(formatStr ?? 'YYYY-MM-DD HH:mm:ss');
    }

    /**
     * Returns the native Date
     */
    toDate(): Date {
        return this._date.toDate();
    }

    /**
     * Returns the internal dayjs instance
     */
    toDayJs(): dayjs.Dayjs {
        return this._date;
    }

    /**
     * Returns the timestamp in milliseconds
     */
    valueOf(): number {
        return this._date.valueOf();
    }

    /**
     * Returns the ISO string
     */
    toISOString(): string {
        return this._date.toISOString();
    }

    /**
     * Checks if the date is valid
     */
    isValid(): boolean {
        return this._date.isValid();
    }

    /**
     * Returns the timezone
     */
    get timeZone(): string | undefined {
        return this._timeZone;
    }

    /**
     * Changes the timezone (creates a new instance)
     */
    tz(timeZone: string): DateTime {
        const newDate = this._date.tz(timeZone);

        return new DateTime(newDate, { timeZone });
    }

    get year(): number {
        return this._date.year();
    }

    get month(): number {
        return this._date.month();
    }

    get date(): number {
        return this._date.date();
    }

    get day(): number {
        return this._date.day();
    }

    get hour(): number {
        return this._date.hour();
    }

    get minute(): number {
        return this._date.minute();
    }

    get second(): number {
        return this._date.second();
    }

    get millisecond(): number {
        return this._date.millisecond();
    }
}

class DateTimeFactory implements IDateTimeFactory {
  now(options?: DateTimeOptions): DateTime {
      return new DateTime(undefined, options);
  }

  fromDate(date: Date, options?: DateTimeOptions): DateTime {
      return new DateTime(date, options);
  }
}

export const dateTime = new DateTimeFactory();
