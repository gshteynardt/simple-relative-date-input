import type { TimeUnit } from './dateTime.ts';
import type dayjs from 'dayjs';

export type DateTimeOptions = {
    timeZone?: string;
};

export type Input = Date | number | string | dayjs.Dayjs;

export interface IDateTime {
    add(amount: number, unit: TimeUnit): IDateTime;
    subtract(amount: number, unit: TimeUnit): IDateTime;
    startOf(unit: TimeUnit): IDateTime;
    endOf(unit: TimeUnit): IDateTime;
    format(formatStr?: string): string;
    toDate(): Date;
    toDayJs(): dayjs.Dayjs;
    valueOf(): number;
    toISOString(): string;
    isValid(): boolean;
    readonly timeZone: string | undefined;
}

export interface IDateTimeFactory {
    now(options?: DateTimeOptions): IDateTime;
    fromDate(date: Date, options?: DateTimeOptions): IDateTime;
}

export interface DateTimeConstructor extends IDateTimeFactory {
  new (input?: Input, options?: DateTimeOptions): IDateTime;
  now(options?: DateTimeOptions): IDateTime;
  fromDate(date: Date, options?: DateTimeOptions): IDateTime;
}

type TimeZoneUtc = 'utc';

type TimeZoneBrowser = 'browser';

type TimeZone = TimeZoneBrowser | TimeZoneUtc | string;

export type ParseOptions = {
  timeZone?: TimeZone;
};
