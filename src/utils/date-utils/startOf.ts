import { type TimeUnit, type DateTimeOptions, DateTime } from './dateTime.ts';

export const startOf = (date: Date, unit: TimeUnit, options?: DateTimeOptions): Date => {
    return new DateTime(date, options).startOf(unit).toDate();
};
